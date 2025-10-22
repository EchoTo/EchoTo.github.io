---
title: Nacos
date: 2025-01-17 15:09:05
tags: [Nacos, SpringCloud]
categories: Nacos
---

## Nacos

---

## 第一章 Nacos配置管理

---

### 1.1 Nacos简介

---

Nacos是阿里的一个开源产品，它是针对微服务架构中的服务发现、配置管理、服务治理的综合型解决方案

---

### 1.2 Nacos特性

---

Nacos主要提供以下四大功能：

**1、服务发现与服务健康检查**

Nacos使服务更容易注册，并通过DNS或HTTP接口发现其他服务，Nacos还提供服务的实时健康检查，以防止向不健康的主机或服务实例发送请求

**2、动态配置管理**

动态配置服务允许在所有环境中以集中和动态的方式管理所有服务的配置，Nacos消除了在更新配置时重新部署应用程序，这使配置的更改更加高效和灵活

**3、动态DNS服务**

Nacos提供基于DNS协议的服务发现能力，旨在支持异构语言的服务发现，支持将注册在Nacos上的服务以域名的方式暴露端点，让三方应用方便的查阅及发现

**4、服务和元数据管理**

Nacos能让用户从微服务平台建设的视角管理数据中心的所有服务及元数据，包括管理服务的描述、生命周期、服务的静态依赖分析、服务的健康状态、服务的流量管理、路由及安全策略

---

### 1.3 Nacos快速入门

---

#### 1.3.1 安装

```shell
docker pull nacos/nacos-server:v2.5.0

docker run -d --name nacos-server \
  -e MODE=standalone \
  -p 8848:8848 \
  nacos/nacos-server:v2.5.0

# 开启鉴权
docker exec -it nacos-server /bin/bash

2f8c80293f4f:/home/nacos# cd conf/
2f8c80293f4f:/home/nacos/conf# vim application.properties

##新增两行
nacos.core.auth.enabled=true
nacos.core.auth.enable.userAgentAuthWhite=false

# 修改三行
nacos.core.auth.plugin.nacos.token.secret.key=${NACOS_AUTH_TOKEN:SecretKey01234567890123456789012345345678999987654901234567890123456789} # 随意数字 不能太短
nacos.core.auth.server.identity.key=${NACOS_AUTH_IDENTITY_KEY:admin}
nacos.core.auth.server.identity.value=${NACOS_AUTH_IDENTITY_VALUE:admin}

# 重启容器
docker restart nacos

# 单机模式nacos默认使用嵌入式数据库实现数据存储，如果想使用mysql存储nacos数据，需要安装mysql数据库，初始化数据库，修改nacos配置
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://ip:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=用户名
db.password=密码
```



#### 1.3.2 Nacos配置入门

**发布配置**

在Nacos中添加如下配置：

```
Data ID:	nacos-simple-demo.yaml
Group:		DEFAULT_GROUP
配置格式:  YAML
配置内容:  common:
            config1: something
```

> tips: dataid是以properties(默认的文件扩展名方式)为扩展名，这里使用yaml

**nacos客户端获取配置**

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>1.2.1</version>
</dependency>
```

```java
import com.alibaba.nacos.api.NacosFactory;
import com.alibaba.nacos.api.config.ConfigService;
import com.alibaba.nacos.api.exception.NacosException;

import java.util.Properties;

public class SimpleDemoMain {
    public static void main(String[] args) throws NacosException {
        String serverAddr = "ip:8848";
        String dataId = "nacos-simple-demo.yaml";
        String group = "DEFAULT_GROUP";

        Properties properties = new Properties();
        properties.put("serverAddr", serverAddr);
        // 如果开启了鉴权, 要添加用户名 密码
        properties.put("username", "nacos");
        properties.put("password", "nacos");
        ConfigService configService = NacosFactory.createConfigService(properties);
        String config = configService.getConfig(dataId, group, 5000);
        System.out.println(config);
        // common:
        //	  config1: something
    }
}
```

<img src="https://tonkyshan.cn/img/20250303114956.png" alt="Nacos"/>

----

### 1.4 Nacos配置管理基础应用

---

#### 1.4.1 Nacos配置管理模型

 对于Nacos配置管理，通过Namespace、group、Data ID能够定位到一个配置集

* Namespace
  * Group
    * Service / DataId

**配置集(Data ID)**

在系统中，一个配置文件通常就是一个**配置集**，一个配置集可以包含了系统的各种配置信息，例如，一个配置集可能包含了数据源、线程池、日志级别等配置项，每个配置集都可以定义一个有意义的名称，就是配置集的ID，即Data ID

**配置项**

**配置集**中包含的一个个配置内容就是**配置项**，它代表一个具体的可配置的参数与其阈值，通常以KV的形式存在



**配置分组(Group)**

配置分组是对配置集进行分组，通过一个有意义的字符串(如Buy或Trade)来表示，不同的配置分组下可以有相同的配置集(Data ID)，在Nacos上创建一个配置时，如果未填写配置分组的名称，则配置分组的名称默认采用DEFAULT_GROUP。配置分组的常见场景：可用于区分不同的项目或应用，例如：学生管理系统的配置集可以定义一个group为：STUDENT_GROUP



**命名空间(Namespace)**

命名空间可用于进行不同环境的配置隔离，例如可以隔离开发环境、测试环境和生产环境，因为它们的配置可能各不相同，或者是隔离不同的用户，不同的开发人员使用同一个nacos管理各自的配置，可通过namespace隔离，不同的命名空间下，可以存在相同名称的配置分组(Group)或配置集



* Namespace：环境
* Group：项目
* Data ID：工程



#### 1.4.2 命名空间管理

**namespace隔离设计**

namespace的设计是nacos基于此做多环境以及多租户(多个用户共同使用nacos)数据(**配置和服务**)隔离的

<img src="https://tonkyshan.cn/img/20250303154824.png" alt="Nacos"/>

<img src="https://tonkyshan.cn/img/20250303154851.png" alt="Nacos"/>



#### 1.4.3 配置管理

* 配置列表：导出 导入 克隆 删除
* 历史版本：查看文件历史版本 回滚
* 监听查询： 实时获取

<img src="https://tonkyshan.cn/img/20250303160728.png" alt="Nacos"/>

```java
import com.alibaba.nacos.api.NacosFactory;
import com.alibaba.nacos.api.config.ConfigService;
import com.alibaba.nacos.api.config.listener.Listener;
import com.alibaba.nacos.api.exception.NacosException;

import java.util.Properties;
import java.util.concurrent.Executor;

public class SimpleDemoMain {
    public static void main(String[] args) throws NacosException {
        String serverAddr = "ip:8848";
        String dataId = "nacos-simple-demo.yaml";
        String group = "DEFAULT_GROUP";

        Properties properties = new Properties();
        properties.put("serverAddr", serverAddr);
        properties.put("username", "nacos");
        properties.put("password", "nacos");
        properties.put("namespace", "33d4ecc4-15d0-48a4-bef1-fe4e77ec9581");
        ConfigService configService = NacosFactory.createConfigService(properties);
        String config = configService.getConfig(dataId, group, 5000);
        System.out.println(config);
        configService.addListener(dataId, group, new Listener() {

            @Override
            public Executor getExecutor() {
                return null;
            }

            @Override
            public void receiveConfigInfo(String s) {
                System.out.println(s);
            }
        });

        while (true) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}

/**
 * common:
 *     config1: something
 * common:
 *     config1: prod
 */
```

#### 1.4.4 用户管理

密码加密方式：BCryptPasswordEncoder

----

### 1.5 Nacos配置管理分布式系统

----

#### 1.5.1 分布式应用配置管理

* 用户通过Nacos Server的控制台集中对多个服务的配置进行管理
* 各服务统一从Nacos Server中获取各自的配置，并监听配置的变化

**发布配置**

在配置管理-配置列表中添加如下配置：

dev

* service1.yaml

  ```
  Namespace: 357928dc-f286-49d9-b79d-fac85a512fe8 # 开发环境
  Data ID: service1.yaml
  Group: TEST_GROUP
  配置格式: YAML
  配置内容: common:
  				   name: service1 config
  ```

* service2.yaml

  ```
  Namespace: 357928dc-f286-49d9-b79d-fac85a512fe8 # 开发环境
  Data ID: service2.yaml
  Group: TEST_GROUP
  配置格式: YAML
  配置内容: common:
  				   name: service2 config
  ```







