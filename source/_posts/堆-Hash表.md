---
title: '堆,Hash表'
date: 2022-02-19 14:04:49
tags: [堆,Hash表]
categories: 数据结构
---

## 堆

---

> 堆通常是一个可以被看做一棵树的数组对象。堆总是满足下列性质：
>
> - 堆中某个结点的值总是不大于或不小于其父结点的值；
> - 堆总是一棵完全二叉树。
>
> 将根结点最大的堆叫做最大堆或大根堆，根结点最小的堆叫做最小堆或小根堆。
>
> **来自百度百科**

**铉杰的解释**

堆就是优先队列，在堆中，它可以动态维护序列的最大值和最小值

#### 例题：

> 维护一个集合，初始时集合为空，支持如下几种操作：
>
> 1. `I x`，插入一个数 x；
> 2. `PM`，输出当前集合中的最小值；
> 3. `DM`，删除当前集合中的最小值（数据保证此时的最小值唯一）；
> 4. `D k`，删除第 k 个插入的数；
> 5. `C k x`，修改第 k 个插入的数，将其变为 x；
>
> 现在要进行 N 次操作，对于所有第 2 个操作，输出当前集合的最小值。
>
> #### 输入格式
>
> 第一行包含整数 N。
>
> 接下来 N 行，每行包含一个操作指令，操作指令为 `I x`，`PM`，`DM`，`D k` 或 `C k x` 中的一种。
>
> #### 输出格式
>
> 对于每个输出指令 `PM`，输出一个结果，表示当前集合中的最小值。
>
> 每个结果占一行。
>
> #### 数据范围
>
> 1≤N≤10^5
> −10^9≤x≤10^9
> 数据保证合法。
>
> #### 输入样例：
>
> ```
> 8
> I -10
> PM
> I -10
> D 1
> C 2 8
> I 6
> PM
> DM
> ```
>
> #### 输出样例：
>
> ```
> -10
> 6
> ```

```java
import java.util.Scanner;

public class Main {
    static int N = (int)1e5 + 10;
    static int h[] = new int[N];
    static int ph[] = new int[N];
    static int hp[] = new int[N];
    static int size = 0;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        int m = 0;
        while (n -- > 0){
            String[] s = sc.nextLine().split(" ");
            String op = s[0];
            int k, x;

            if (op.equals("I")){
                x = Integer.parseInt(s[1]);
                ++ size;
                ++ m;
                ph[m] = size;
                hp[size] = m;

                h[size] = x;
                up(size);
            }
            else if (op.equals("PM")) System.out.println(h[1]);
            else if (op.equals("DM")){
                heap_swap(1,size);
                size --;
                down(1);
            }
            else if (op.equals("D")){
                k = Integer.parseInt(s[1]);
                k = ph[k];
                heap_swap(k,size);
                size --;
                down(k);
                up(k);
            }
            else if (op.equals("C")){
                k = Integer.parseInt(s[1]);
                x = Integer.parseInt(s[2]);
                k = ph[k];
                h[k] = x;
                down(k);
                up(k);
            }
        }
        sc.close();
    }

    public static void swap(int a[], int x, int y){
        int temp = a[x];
        a[x] = a[y];
        a[y] = temp;
    }

    public static void heap_swap(int a, int b){
        swap(ph,hp[a],hp[b]);
        swap(hp,a,b);
        swap(h,a,b);
    }

    public static void down(int u){
        int t = u;
        if (u << 1 <= size && h[u << 1] < h[t]) t = u << 1;
        if ((u << 1 | 1) <= size && h[u << 1 | 1] < h[t]) t = u << 1 | 1;
        if (t != u){
            heap_swap(t,u);
            down(t);
        }
    }

    public static void up(int u){
        while (u >> 1 > 0 && h[u] < h[u >> 1]){
            heap_swap(u,u >> 1);
            up(u >> 1);
        }
    }
}
```

--------

## Hash表

-----

**解决哈希冲突的两种办法**

* 拉链法
* 开放寻址法

**1.拉链法**

将所有哈希地址相同的记录都链接在同一链表中

`公式：h(x) = x mod (Hashtable.length);`

![](https://cdn.jsdelivr.net/gh/EchoTo/blog-img@main/img/QQ截图20220617203603.png)

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    static int N = (int)1e5 + 10;
    static int idx;
    static int h[] = new int[N];
    static int e[] = new int[N];
    static int ne[] = new int[N];

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int T = sc.nextInt();
        Arrays.fill(h,-1);
        
        while (T -- != 0){
            char op = sc.next().charAt(0);
            int x = sc.nextInt();
            
            if (op == 'I') insert(x);
            else {
                if (query(x)) System.out.println("Yes");
                else System.out.println("No");
            }
        }
        
        sc.close();
    }

    public static int ha(int x){
        return (x % N + N) % N;
    }

    public static void add(int a,int b){
        e[idx] = b;
        ne[idx] = h[a];
        h[a] = idx ++;
    }

    public static void insert(int x){
        int t = ha(x);
        add(t,x);
    }

    public static boolean query(int x){
        int t = ha(x);
        for (int i = h[t]; i != -1 ; i = ne[i]) {
            int j = e[i];
            if (j == x) return true;
        }
        return false;
    }
}
```

**2.开放寻址法**

**(1)线性探测法**

当我们的所需要存放值的位置被占了，我们就往后面一直加1并对m取模直到存在一个空余的地址供我们存放值，取模是为了保证找到的位置在0~m-1的有效空间之中。

`公式：h(x) = (Hash(x)+i) mod (Hashtable.length);（i会逐渐递增加1）`

![](https://cdn.jsdelivr.net/gh/EchoTo/blog-img@main/img/QQ截图20220617203703.png)

**(2)平方探测法(二次探测)**

当我们的所需要存放值的位置被占了，会前后寻找而不是单独方向的寻找。

`公式：h(x) = (Hash(x) +i) mod (Hashtable.length);（i依次为+(i^2)和-(i^2)）`

![](https://cdn.jsdelivr.net/gh/EchoTo/blog-img@main/img/QQ截图20220617203758.png)

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    static int N = (int)2e5 + 10;
    static int h[] = new int[N];
    static int INF = 0x3f3f3f3f;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int T = sc.nextInt();
        Arrays.fill(h,0x3f);

        while (T -- != 0){
            char op = sc.next().charAt(0);
            int x = sc.nextInt();

            if (op == 'I') insert(x);
            else {
                if (query(x)) System.out.println("Yes");
                else System.out.println("No");
            }
        }

        sc.close();
    }

    public static int ha(int x){
        return (x % N + N) % N;
    }

    public static void insert(int x){
        int t = ha(x);
        while (h[t] != INF && h[t] != x){
            t = (t + 1) % N;
        }
        h[t] = x;
    }

    public static boolean query(int x){
        int t = ha(x);
        while (h[t] != x && h[t] != INF){
            t = (t + 1) % N;
        }
        return h[t] == x;
    }
}
```

-------

**字符串哈希**

字符串Hash可以通俗的理解为，**把一个字符串转换为一个n进制下的数**。

也可以认为字符串哈希是进制的转换

给定一个字符串S = s1s2s3...sn，对于字母x，我们规定idx(x) = x - 'a' + 1。(也可以直接使用ASCII值)

**Hash公式**`hash[i] = (hash[i - 1]) * p + idx(s[i]) % mod`

其中p和mod均为质数，且有p < mod。p一般取131或13331

对于此种Hash方法，将p和mod尽量取大即可，这种情况下，冲突的概率是很低的。

#### 例题：

> 给定一个长度为 n 的字符串，再给定 m 个询问，每个询问包含四个整数 l1,r1,l2,r2，请你判断 [l1,r1]和 [l2,r2] 这两个区间所包含的字符串子串是否完全相同。
>
> 字符串中只包含大小写英文字母和数字。
>
> #### 输入格式
>
> 第一行包含整数 n 和 m，表示字符串长度和询问次数。
>
> 第二行包含一个长度为 n 的字符串，字符串中只包含大小写英文字母和数字。
>
> 接下来 m 行，每行包含四个整数 l1,r1,l2,r2，表示一次询问所涉及的两个区间。
>
> 注意，字符串的位置从 1 开始编号。
>
> #### 输出格式
>
> 对于每个询问输出一个结果，如果两个字符串子串完全相同则输出 `Yes`，否则输出 `No`。
>
> 每个结果占一行。
>
> #### 数据范围
>
> 1≤n,m≤10^5
>
> #### 输入样例：
>
> ```
> 8 3
> aabbaabb
> 1 3 5 7
> 1 3 6 8
> 1 2 1 2
> ```
>
> #### 输出样例：
>
> ```
> Yes
> No
> Yes
> ```

```java
import java.util.Scanner;

public class Main {
    static int N = (int)1e5 + 10;
    static int P = 131;
    static int n,m;
    static char str[] = new char[N];
    static long h[] = new long[N];
    static long p[] = new long[N];

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        m = sc.nextInt();

        String s = sc.next();
        char[] chars = s.toCharArray();

        for (int i = 0; i < chars.length; i++) {
            str[i + 1] = chars[i];
        }
        p[0] = 1;
        for (int i = 1; i <= n; i++) {
            h[i] = h[i - 1] * P + str[i];
            p[i] = p[i - 1] * P;
        }

        while (m -- != 0){
            int l1 = sc.nextInt();
            int r1 = sc.nextInt();
            int l2 = sc.nextInt();
            int r2 = sc.nextInt();
            if (get(l1,r1) == get(l2,r2)) {
                System.out.println("Yes");
            }
            else System.out.println("No");
        }
        sc.close();
    }

    public static long get(int l,int r){
        return h[r] - h[l - 1] * p[r - l + 1];
    }
}
```
