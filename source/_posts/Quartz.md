---
title: Quartz
date: 2024-08-08 22:07:08
tags: [Quartz,Java]
categories: Quartz
---

## 前置

---

### 小顶堆和时间轮算法

------

**小顶堆**

完全二叉树：除了最后一层外，其他层节点数必须达到最大，最后一层靠左排列

堆也是一颗完全二叉树，但是它的元素必须满足每个节点的值都不大于（或不小于）其父节点的值

定时任务用小顶堆进行：各个节点的值对应job的dilay

**时间轮算法**

* 链表或者数组实现时间轮：while-true-sleep 遍历数组，每个下标放置一个链表，链表节点放置任务，遍历到了就取出执行
  * 缺陷：范围小，无法实现复杂的定时任务
* round型时间轮：任务上记录一个round，遍历到了就将round减1，为0时取出执行
  * 缺陷：需要遍历所有的任务，效率较低
* 分层时间轮：使用多个不同时间维度的轮
  * 天轮：记录几点执行
  * 月轮：记录几号执行
  * 月轮遍历到了，将任务取出放到天轮里面，即可实现几号几点执行

----

## 第一章 JDK定时器timer使用及原理分析

-----

### 1.1 timer的使用

----

```java
package com.priv.timer;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class TimerTest {
    public static void main(String[] args) {
        // 任务启动
        Timer t = new Timer();

        for (int i = 0; i < 2; i++) {
            FooTimerTask task = new FooTimerTask("foo" + i);
            // 任务添加
            t.schedule(task, new Date(), 2000);
        }
    }
}

class FooTimerTask extends TimerTask {

    private String name;

    public FooTimerTask(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        try {
            System.out.println("name: " + name + "startTime: " + new Date());
            Thread.sleep(3000);
            System.out.println("name: " + name + "endTime: " + new Date());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

---

### 1.2 timer的数据结构和原理分析 && 存在的问题

----

**Timer**

* 定时（指定时间执行任务）
* 延迟（延迟一段时间执行任务）
* 周期性执行任务（每隔一段时间执行任务）

**缺陷：**

* Timer在执行所有定时任务时只会创建一个线程，如果某个任务执行时间大于其周期长度，就会导致本次任务还在执行，而下一个周期任务已经需要开始执行了。一个线程内两个任务只能顺序执行，对于之前需要执行但是还没有执行的任务，有两种情况
  * 当前任务执行完马上执行那些任务（顺序）
  * 把那些任务丢掉，不去执行
* 如果TimerTask抛出一个未检查异常，那么Timer线程就会被终止掉，之前已经被调度但尚未执行的TimerTask就不会再执行了，新的任务也不能被调度了
* Timer支持基于绝对时间的调度机制，不支持基于相对时间的调度机制，所以任务的执行对系统时钟变化很敏感

**实现原理**

Timer有两个内部类，TaskQueue和TimerThread，TaskQueue其实就是一个最小堆（按TimerTask下一个任务执行时间点先后排序），存放该Timer的所有TimerTask，而TimerThread就是Timer新开的检查兼执行线程，在run中用一个死循环不断检查是否有任务需要开始执行了，有就执行它（任务还是在这个线程执行）

Timer实现的关键就是调度方法，也就是TimerThread的run方法：

```java
public void run() {
    try {
        mainLoop();
    } finally {
        // Someone killed this Thread, behave as if Timer cancelled
        synchronized(queue) {
            newTasksMayBeScheduled = false;
            queue.clear();  // Eliminate obsolete references
        }
    }
}
```

具体逻辑在mainLoop方法中实现：

```java
private void mainLoop() {
    while (true) {
        try {
            TimerTask task;
            boolean taskFired;
            synchronized(queue) {
                // Wait for queue to become non-empty
                while (queue.isEmpty() && newTasksMayBeScheduled)
                    queue.wait();
                if (queue.isEmpty())
                    break; // Queue is empty and will forever remain; die

                // Queue nonempty; look at first evt and do the right thing
                long currentTime, executionTime;
                task = queue.getMin();
                synchronized(task.lock) {
                    if (task.state == TimerTask.CANCELLED) {
                        queue.removeMin();
                        continue;  // No action required, poll queue again
                    }
                    currentTime = System.currentTimeMillis();
                    executionTime = task.nextExecutionTime;
                    if (taskFired = (executionTime<=currentTime)) {
                        if (task.period == 0) { // Non-repeating, remove
                            queue.removeMin();
                            task.state = TimerTask.EXECUTED;
                        } else { // Repeating task, reschedule
                            queue.rescheduleMin(
                              task.period<0 ? currentTime   - task.period
                                            : executionTime + task.period);
                        }
                    }
                }
                if (!taskFired) // Task hasn't yet fired; wait
                    queue.wait(executionTime - currentTime);
            }
            if (taskFired)  // Task fired; run it, holding no locks
                task.run();
        } catch(InterruptedException e) {
        }
    }
}
```

`task = queue.getMin();`：取出最先需要执行的那个TimerTask，然后判断executionTime<=currentTime，其中executionTime就是该TimerTask下一个周期任务执行的时间点，currentTime为当前时间点，如果说为true，说明该任务需要执行了（可能是一个过时任务，应该在过去某个时间点开始执行，但由于某种原因还没有执行）判断`task.period == 0`，Timer中period默认为0，表示该TimerTask只会执行一次，不会周期性地不断执行，所以为true就移除掉该TimerTask，然后待会会执行该TimerTask一次，如果`task.period`不为0，那就分小于0和大于0。

* 如果调用的是schedule方法，那么`task.period`就小于0：

```java
public void schedule(TimerTask task, long delay, long period) {
    if (delay < 0)
        throw new IllegalArgumentException("Negative delay.");
    if (period <= 0)
        throw new IllegalArgumentException("Non-positive period.");
    sched(task, System.currentTimeMillis()+delay, -period);
}
```

* 如果调用的是scheduleAtFixedRate方法，那么`task.period`就大于0：

```java
public void scheduleAtFixedRate(TimerTask task, long delay, long period) {
    if (delay < 0)
        throw new IllegalArgumentException("Negative delay.");
    if (period <= 0)
        throw new IllegalArgumentException("Non-positive period.");
    sched(task, System.currentTimeMillis()+delay, period);
}
```

当`period < 0`时，当前TimerTask下一次开始执行任务的时间就会被设置为`currentTime - task.period`，可以理解为定时任务被重置，从现在开始，period周期间隔（那么之前预想在这个间隔内 存在的任务执行就没有了）后执行一次任务，这种情况就是Timer的任务可能丢失的问题。

当`period > 0`时，当前TimerTask下一次开始执行任务的时间就会被设置为`executionTime + task.period`，即下一次任务还是按原来的算，如果这时`executionTime + task.period`还先于currentTime，那么下一个任务就会马上执行，也就是Timer的任务快速调用问题。

**以上是第一种缺陷发生的原因**

**以下是第二种缺陷发生的原因**

mainLoop中在死循环只catch了一个InterruptedException，也就是当前线程被中断，Timer的线程是可以执行一段时间，然后被操作系统挂在一边休息，然后又回来执行的。但如果抛出其它异常，那么整个循环就会挂掉。外层的run方法也没有catch任何异常。这时就会造成线程泄露，同时之前已经被调度但尚未执行的TimerTask就不会再执行了，新的任务也不能被调度了。

**解决缺陷**

对于Timer的缺陷，我们可以考虑使用ScheduledThreadPoolExecutor来替代。Timer是基于绝对时间的，对系统时间比较敏感，而ScheduledThreadPoolExecutor则是基于相对时间，Timer是内部单一线程的，而ScheduledThreadPoolExecutor内部是线程池，所以可以支持多个任务并发执行。

**解决问题一：**

```java
public class ScheduledExecutorTest {  
    private  ScheduledExecutorService scheduExec;  

    public long start;  

    ScheduledExecutorTest(){  
        this.scheduExec =  Executors.newScheduledThreadPool(2);    
        this.start = System.currentTimeMillis();  
    }  

    public void timerOne(){  
        scheduExec.schedule(new Runnable() {  
            public void run() {  
                System.out.println("timerOne,the time:" + (System.currentTimeMillis() - start));  
                try {  
                    Thread.sleep(4000);  
                } catch (InterruptedException e) {  
                    e.printStackTrace();  
                }  
            }  
        },1000,TimeUnit.MILLISECONDS);  
    }  

    public void timerTwo(){  
        scheduExec.schedule(new Runnable() {  
            public void run() {  
                System.out.println("timerTwo,the time:" + (System.currentTimeMillis() - start));  
            }  
        },2000,TimeUnit.MILLISECONDS);  
    }  

    public static void main(String[] args) {  
        ScheduledExecutorTest test = new ScheduledExecutorTest();  
        test.timerOne();  
        test.timerTwo();  
    }  
}  
```

**运行结果**

```
timerOne,the time:1003  
timerTwo,the time:2005  
```

**解决问题二：**

```java
public class ScheduledThreadPoolDemo01 {

    public static void main(String[] args) throws InterruptedException {

        final TimerTask task1 = new TimerTask() {

            @Override
            public void run() {
                throw new RuntimeException();
            }
        };

        final TimerTask task2 = new TimerTask() {

            @Override
            public void run() {
                System.out.println("task2 invoked!");
            }
        };

        ScheduledExecutorService pool = Executors.newScheduledThreadPool(1);
        pool.schedule(task1, 100, TimeUnit.MILLISECONDS);
        pool.scheduleAtFixedRate(task2, 0, 1000, TimeUnit.MILLISECONDS);

    }
}
```

**运行结果**

```
task2 invoked!  
task2 invoked!  
task2 invoked!  
task2 invoked!  
task2 invoked! 
```

**埋点：**

这时都是并行执行的，当设置定时job时，假设5s执行一次缓存job，某一次job执行了6s，会在第5s产生一个相同任务与之前的任务并行执行，会不会产生脏数据？？

----

### 1.3 Leader-Follower模式

----

假设有一堆等待执行的任务（一般是存放在一个队列中排好序），而所有的工作线程只会有一个**leader线程**，其它线程都是**follower线程**，只有**leader线程**能执行任务，而剩下的**follower线程**则处于休眠状态。当**leader线程**拿到任务后，执行任务前，自己会变为**follower线程**，同时会选出一个新的**leader线程**，然后才去执行任务。如果此时有下一个任务，就是这个新的**leader线程**去执行了，并重复这个过程。当之前那个执行任务的线程执行完毕再回来时，如果此时已经没有任务或者已经有其他线程作为**leader线程**那么自己就休眠了，如果此时有任务但没有**leader线程**，那么会重新成为**leader线程**去执行任务。

* 避免了没必要的唤醒和阻塞操作，这样会更加有效且节省资源

-----

## 第二章 定时任务框架quartz

---

### 2.1 使用简介

----

Quartz是`OpenSymphony`开源组织在`Job scheduling`领域又一个开源项目，完全由Java开发，可以用来执行定时任务，类似于`java.util.Timer`。但是相较于Timer， Quartz增加了很多功能：

* 持久性作业：保持调度定时的状态
* 作业管理：对调度作业进行有效的管理

-----

### 2.2 各组件介绍

----

* **任务Job：**需要实现的任务类，实现execute()方法，执行后完成任务
* **触发器Tigger：**包括SimpleTrigger和CronTrigger
* **调度器Scheduler：**任务调度器，负责基于Trigger触发器，来执行Job任务

**Demo**

一、导包

```xml
<!-- 核心包 -->
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.0</version>
</dependency>
<!-- 工具包 -->
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz-jobs</artifactId>
    <version>2.3.0</version>
</dependency>
```

二、新建任务，实现Job接口

```java
public class MyJob implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        System.out.println("任务被执行了。。。");
    }
}
```

三、main方法，创建调度器、jobDetail实例、trigger实例

```java
public static void main(String[] args) throws Exception {
    // 1.创建调度器 Scheduler
    SchedulerFactory factory = new StdSchedulerFactory();
    Scheduler scheduler = factory.getScheduler();
 
    // 2.创建JobDetail实例，并与MyJob类绑定(Job执行内容)
    JobDetail job = JobBuilder.newJob(MyJob.class)
        .withIdentity("job1", "group1")
        .build();
 
    // 3.构建Trigger实例,每隔30s执行一次
    Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("trigger1", "group1")
        .startNow()
        .withSchedule(simpleSchedule()
                      .withIntervalInSeconds(30)
                      .repeatForever())
        .build();
 
    // 4.执行，开启调度器
    scheduler.scheduleJob(job, trigger);
    System.out.println(System.currentTimeMillis());
    scheduler.start();
 
    //主线程睡眠1分钟，然后关闭调度器
    TimeUnit.MINUTES.sleep(1);
    scheduler.shutdown();
    System.out.println(System.currentTimeMillis());
}
```

**JobDetail**

绑定Job，是一个任务实例，为Job添加了许多扩展参数

* name：任务名称
* group：任务分组，默认分组DEFAULT
* jobClass：任务类，就是上面Demo中的MyJob的路径
* jobDataMap：任务参数信息，JobDetail、Trigger都可以使用JobDataMap来设置一些参数或信息

每次Scheduler调度执行一个Job的时候，首先会拿到对应的Job，然后创建该Job实例，再去执行Job中execute()的内容，任务执行结束后，关联的Job对象实例会被释放，且会被JVM GC清除。

**为什么设计成JobDetail + Job，不直接使用Job**

JobDetail定义的是任务数据，而真正的执行逻辑在Job中。这是因为任务是有可能并发执行的，如果Scheduler直接使用Job，就会存在对同一个Job实例并发访问的问题，而JobDetail & Job方式，Scheduler每次执行，都会根据JobDetail创建一个新的Job实例，这样就可以规避并发访问的问题

**Job**

* @DisallowConcurrentExecution：禁止并发的执行同一个job定义（JobDetail定义的）的多个实例
* @PersistJobDataAfterExecution：持久化JobDetail中的JobDataMap（对Trigger中的datamap无效），如果一个任务不是持久化的，则当它没有触发器关联它的时候，Quartz会从schedule中删除它
* 如果一个任务请求恢复，一般是该任务执行期间发生了系统崩溃或者其他关闭进程的操作，当服务再次启动的时候，会再次执行该任务，此时，JobExecutionContext.isRecovering()会返回true



**JobExecutionContext**

* 当Scheduler调用一个Job，就会将JobExecutionContext传递给Job的execute()方法
* Job能通过JobExecutionContext对象访问到Quartz运行时候到环境以及Job本身的明细数据

任务实现的execute()方法，可以通过context参数获取

```java
public interface Job {
    void execute(JobExecutionContext context)
        throws JobExecutionException;
}
```

在Builder建造过程中，可以使用如下方法：

```java
usingJobData("tiggerDataMap", "测试传参")
```

在execute方法中获取：

```java
context.getTrigger().getJobDataMap().get("tiggerDataMap");
context.getJobDetail().getJobDataMap().get("tiggerDataMap");
```



**JobDataMap**

保存任务实例的状态信息

* jobDetail：默认只在Job被添加到调度程序（任务执行计划表）scheduler的时候，存储一次关于该任务的状态信息数据，可以使用注解**@PersistJobDataAfterExecution**注解标明在一个任务执行完毕之后就存储一次
* trigger：任务被多个触发器引用的时候，根据不同的触发时机，可以提供不同的输入条件

Job状态参数，有状态的job可以理解为多次job调用期间可以持有一些状态信息，这些状态信息存储在JobDataMap中

而默认无状态的job，每次调用时都会创建一个新的JobDataMap

示例：

```java
//多次调用 Job 的时候，将参数保留在 JobDataMap
@PersistJobDataAfterExecution
public class JobStatus implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        long count = (long) context.getJobDetail().getJobDataMap().get("count");
        System.out.println("当前执行，第" + count + "次");
        context.getJobDetail().getJobDataMap().put("count", ++count);
    }
}

// 当前执行，第1次
// [main] INFO org.quartz.core.QuartzScheduler - Scheduler DefaultQuartzScheduler_$_NON_CLUSTERED started.
// 当前执行，第2次
// 当前执行，第3次
```

```java
JobDetail job = JobBuilder.newJob(JobStatus.class)
                .withIdentity("statusJob", "group1")
                .usingJobData("count", 1L)
                .build();
```



**Trigger**

**优先级**

同时触发的trigger之间才会比较优先级，如果trigger是可恢复的，在恢复后再调度时，优先级不变

**定时启动/关闭**

Trigger可以设置任务的开始结束时间，Scheduler会根据参数进行触发

```java
Calendar instance = Calendar.getInstance();
Date startTime = instance.getTime();
instance.add(Calendar.MINUTE, 1);
Date endTime = instance.getTime();
 
// 3.构建Trigger实例
Trigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("trigger1", "group1")
    // 开始时间
    .startAt(startTime)
    // 结束时间
    .endAt(endTime)
    .build();
```

在job中也能拿到对应的时间，并进行业务判断

```java
public void execute(JobExecutionContext context) throws JobExecutionException {
    System.out.println("任务执行。。。");
    System.out.println(context.getTrigger().getStartTime());
    System.out.println(context.getTrigger().getEndTime());
}
```

**misfire 错过触发**

判断条件：

* Job到达触发时间时没有被执行
* 被执行的延迟时间超过了Quartz配置的misfireThreshold阈值

产生原因：

* 当Job到达触发时间时，所有线程都被其他Job占用，没有可用的线程
* 在Job需要触发的时间点，schedule停止了（可能是意外停止）
* Job使用了@DisallowConcurrentExecution注解，Job不能并发执行，当达到下一个job执行点的时候，上一个任务还没完成
* Job指定了过去的开始时间，例如当前时间时9点00分00秒，指定开始时间为8点00分00秒

策略：

* 默认：**MISFIRE_INSTRUCTION_SMART_POLICY**

* **SimpleTrigger**

  * **now\*相关的策略**：会立即执行第一个misfire的任务，同时会修改startTime和repeatCount，因此会重新计算finalFireTime，原计划执行时间会被打乱。
  * **next\*相关的策略**：不会立即执行misfire的任务，也不会修改startTime和repeatCount，因此finalFireTime不会被重新计算，misfire也是按照原计划进行执行。

* **CronTrigger**

  ```java
  // 所有的misfile任务马上执行
  public static final int MISFIRE_INSTRUCTION_IGNORE_MISFIRE_POLICY = -1;
   
  // 在Trigger中默认选择MISFIRE_INSTRUCTION_FIRE_ONCE_NOW 策略
  public static final int MISFIRE_INSTRUCTION_SMART_POLICY = 0;
   
  // 合并部分misfire，正常执行下一个周期的任务。
  public static final int MISFIRE_INSTRUCTION_FIRE_ONCE_NOW = 1;
   
  // 所有的misfire都不管，执行下一个周期的任务。
  public static final int MISFIRE_INSTRUCTION_DO_NOTHING = 2;
  ```

  

**SimpleTrigger**

这是比较简单的一类触发器，用它能实现很多基础的应用，使用场景：

* 在指定时间段内，执行一次任务

最基础的Trigger不设置循环，设置开始时间

* 在指定时间段内，循环执行任务

在上一个场景基础上加上循环间隔，可以指定永远循环、运行指定次数

```java
TriggerBuilder.newTrigger()
    .withSchedule(SimpleScheduleBuilder
                  .simpleSchedule()
                  .withIntervalInSeconds(30)
                  .repeatForever())
  
  //withRepeatCount(count) 是重复次数，实际运行次数为 count+1
  TriggerBuilder.newTrigger()
    .withSchedule(SimpleScheduleBuilder
                  .simpleSchedule()
                  .withIntervalInSeconds(30)
                  .withRepeatCount(5))
```

* 立即开始，指定时间结束



**CronTrigger**

CronTrigger是基于日历的任务调度器，在实际应用中更加常用

```java
TriggerBuilder.newTrigger().withSchedule(CronScheduleBuilder.cronSchedule("* * * * * ?"))
  
  // Cron表达式是一个字符串，字符串以5或6个空格隔开，分为6或7个域，每一个域代表一个含义，Cron有如下两种语法格式：

//（1） Seconds Minutes Hours DayofMonth Month DayofWeek Year

//（2）Seconds Minutes Hours DayofMonth Month DayofWeek
```

| 序号 | 说明 | 是否必填 |   允许填写的值   | 允许的通配符  |
| :--: | :--: | :------: | :--------------: | :-----------: |
|  1   |  秒  |    是    |       0-59       |    , - * /    |
|  2   |  分  |    是    |       0-59       |    , - * /    |
|  3   | 小时 |    是    |       0-23       |    , - * /    |
|  4   |  日  |    是    |       1-31       | , - * ? / L W |
|  5   |  月  |    是    | 1-12 or JAN-DEC  |    , - * /    |
|  6   |  周  |    是    |  1-7 or SUN-SAT  | , - * ? / L # |
|  7   |  年  |    否    | empty或1970-2099 |    , - * /    |

（1）*：**表示匹配该域的任意值。假如在Minutes域使用, 即表示每分钟都会触发事件。

（2）?：只能用在DayofMonth和DayofWeek两个域。它也匹配域的任意值，但实际不会。因为DayofMonth和DayofWeek会相互影响。例如想在每月的20日触发调度，不管20日到底是星期几，则只能使用如下写法： 13 13 15 20 * ?, 其中最后一位只能用？，而不能使用 **，如果使用 *表示不管星期几都会触发，实际上并不是这样。

（3）-：表示范围。例如在Minutes域使用5-20，表示从5分到20分钟每分钟触发一次

（4）/：表示起始时间开始触发，然后每隔固定时间触发一次。例如在Minutes域使用5/20,则意味着5分钟触发一次，而25，45等分别触发一次.

（5）,：表示列出枚举值。例如：在Minutes域使用5,20，则意味着在5和20分每分钟触发一次。

（6）L：表示最后，只能出现在DayofWeek和DayofMonth域。如果在DayofWeek域使用5L,意味着在最后的一个星期四触发。

（7）W:表示有效工作日(周一到周五),只能出现在DayofMonth域，系统将在离指定日期的最近的有效工作日触发事件。例如：在 DayofMonth使用5W，如果5日是星期六，则将在最近的工作日：星期五，即4日触发。如果5日是星期天，则在6日(周一)触发；如果5日在星期一到星期五中的一天，则就在5日触发。另外一点，W的最近寻找不会跨过月份 。

（8）LW:这两个字符可以连用，表示在某个月最后一个工作日，即最后一个星期五。

（9）#:用于确定每个月第几个星期几，只能出现在DayofWeek域。例如在4#1，表示某月的第二个星期三。



**并发执行**

上面有并发和非并发的区别，通过 @DisallowConcurrentExecution 注解来实现阻止并发。

Quartz定时任务默认都是并发执行的，不会等待上一次任务执行完毕，只要间隔时间到就会执行, 如果定时任执行太长，会长时间占用资源，导致其它任务堵塞。

@DisallowConcurrentExecution 禁止并发执行多个相同定义的JobDetail, 这个注解是加在Job类上的, 但意思并不是不能同时执行多个Job, 而是不能并发执行同一个Job Definition(由JobDetail定义), 但是可以同时执行多个不同的JobDetail。

举例说明，我们有一个Job类,叫做SayHelloJob, 并在这个Job上加了这个注解, 然后在这个Job上定义了很多个JobDetail, 如sayHelloToJoeJobDetail, sayHelloToMikeJobDetail, 那么当scheduler启动时, 不会并发执行多个sayHelloToJoeJobDetail或者sayHelloToMikeJobDetail, 但可以同时执行sayHelloToJoeJobDetail跟sayHelloToMikeJobDetail

@PersistJobDataAfterExecution 同样, 也是加在Job上。可以将JobDataMap持久化，表示当正常执行完Job后, JobDataMap中的数据应该被改动, 以被下一次调用时用。

当使用 @PersistJobDataAfterExecution 注解时, 为了避免并发时, 存储数据造成混乱, 强烈建议把 @DisallowConcurrentExecution 注解也加上。

测试代码，设定的时间间隔为3秒,但job执行时间是5秒,设置 @DisallowConcurrentExecution以 后程序会等任务执行完毕以后再去执行,否则会在3秒时再启用新的线程执行。



**Schedule**

调度器，基于trigger的设定执行job

1、SchedulerFactory

* 创建Scheduler
* DirectSchedulerFactory：在代码里定制Scheduler参数
* StdSchedulerFactory：读取classpath下的quartz.properties配置来实例化Scheduler

2、JobStore

存储运行时的信息，包括Trigger、Scheduler、JobDetail、业务锁等

* RAMJobStore：内存实现，轻量级，速度快，应用重启时相关信息都将丢失
* JobStoreTX：JDBC，事务由Quartz管理，不参与全局事务
* JobStoreCMT：JDBC，使用容器（全局）事务，不会自己去管理事务，在完成数据库操作时，它不会自己提交，由全局事务管理程序，对全局事务进行统一的提交或者回滚
* ClusteredJobStore：集群实现
* TerracottaJobStore：Terracotta中间件

----

### 2.3 springboot整合quartz

----

**引入依赖**

```xml
   <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-quartz</artifactId>
    </dependency>
```

**定义Job类**

继承QuartzJobBean

```java
package com.priv.quartz;

import org.quartz.*;
import org.springframework.scheduling.quartz.QuartzJobBean;
import java.util.Date;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 11:24
 * @description:
 **/
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
public class QuartzJob extends QuartzJobBean {
    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        try {
            Thread.sleep(2000);
            System.out.println(jobExecutionContext.getScheduler().getSchedulerInstanceId());
            System.out.println("taskName = " + jobExecutionContext.getJobDetail().getKey().getName());
            System.out.println("执行时间：" + new Date());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

**配置调度器**

```java
package com.priv.quartz;

import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

import javax.sql.DataSource;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.Executor;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 11:33
 * @description:
 **/
@Configuration
public class SchedulerConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public Scheduler scheduler() throws IOException {
        return schedulerFactoryBean().getScheduler();
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean() throws IOException {
        SchedulerFactoryBean factoryBean = new SchedulerFactoryBean();
        factoryBean.setSchedulerName("test-scheduler");
        // 注入数据源
        factoryBean.setDataSource(dataSource);
        // 选项
        factoryBean.setApplicationContextSchedulerContextKey("application");
        factoryBean.setQuartzProperties(quartzProperties());
        // 读取线程池配置
        factoryBean.setTaskExecutor(schedulerThreadPool());
        return factoryBean;
    }

    @Bean
    public Properties quartzProperties() throws IOException {
        YamlPropertiesFactoryBean yamlPropertiesFactoryBean = new YamlPropertiesFactoryBean();
        yamlPropertiesFactoryBean.setResources(new ClassPathResource("/spring-quartz.yml"));
        yamlPropertiesFactoryBean.afterPropertiesSet();
        return yamlPropertiesFactoryBean.getObject();
    }

    @Bean
    public Executor schedulerThreadPool() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        // 核心线程数
        taskExecutor.setCorePoolSize(Runtime.getRuntime().availableProcessors());
        // 最大线程数
        taskExecutor.setMaxPoolSize(Runtime.getRuntime().availableProcessors());
        // 容量
        taskExecutor.setQueueCapacity(Runtime.getRuntime().availableProcessors());
        return taskExecutor;
    }
}
```

**监听器**

```java
package com.priv.quartz;

import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 14:09
 * @description:
 **/
@Component
public class StartApplicationListener implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private Scheduler scheduler;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        // 开启调度
        // JobDetail有一个类型为JobKey的重要属性key，相当于是该任务的键值，JobDetail注册到任务调度器Schedule中的时候，key值不允许重复。
        // 整个任务调度过程中，Quartz都是通过JobKey来唯一识别JobDetail的。试图将重复键值的JobDetail注册到任务调度器中而不指定覆盖的话，是不被允许的。
        // JobKey可以通过JobBuilder的withIdentity方法指定，该方法接收name或name+group参数，从而唯一确定一个任务JobDetail。
        // 如果在JobDetail创建过程中不指定JobKey的话，Quartz会通过UUID的方式为该任务生成一个唯一的key值。
        // 所以，同一个Job实现类（也就是同一个任务），可以通过不同的JobKey值注册到任务调度器中、绑定不同的触发器执行

        TriggerKey triggerKey = TriggerKey.triggerKey("trigger1", "group1");
        try {
            Trigger trigger = scheduler.getTrigger(triggerKey);
            if (trigger == null)
            {
                // 触发器
                trigger = TriggerBuilder.newTrigger()
                        .withIdentity(triggerKey)
                        .withSchedule(CronScheduleBuilder.cronSchedule("0/10 * * * * ?"))
                        .startNow()
                        .build();

                JobDetail jobDetail = JobBuilder.newJob(QuartzJob.class).withIdentity("job1", "group1").build();
                scheduler.scheduleJob(jobDetail, trigger);
                scheduler.start();
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
}
```
