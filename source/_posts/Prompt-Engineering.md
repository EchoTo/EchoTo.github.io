---
title: Prompt Engineering 与 LLM 应用开发
mathjax: true
date: 2026-04-30 11:40:20
tags: [AI Coding, Prompt Engineering, LLM, RAG, Agent, LangChain]
categories: [AI Coding, LLM]
---

## Prompt Engineering 与 LLM 应用开发

  ### 定位

从 Prompt Engineering 入门，扩展到 RAG、Agent、多 Agent 工作流、LangGraph、MCP 和模型微调

  ### 学习路线

  1. Prompt Engineering
  2. 大模型基础
  3. RAG 与知识库
  4. LangChain
  5. Agent
  6. CrewAI 多 Agent
  7. LangGraph 与 MCP
  8. Hugging Face 与模型微调

----

### 一、Prompt Engineering

----

#### 1、Prompt调优

找到好的prompt是个持续迭代的过程，需要不断调优

如果知道训练数据是怎样的，参考训练数据来构造prompt是最好的

不知道训练数据：

* 看Ta是否主动告诉你。例如已知：OpenAI GPT对Markdown格式友好，claude对XML友好
* 不断尝试

高质量prompt核心要点：

> 具体、丰富、少歧义

#### 2、Prompt的典型构成

* **角色**：给AI定义一个最匹配任务的角色，比如：【你是一位软件工程师】 【你是一位小学老师】
* **指示**：对任务进行描述
* **上下文**：给出与任务相关的其他背景信息(尤其在多轮交互中)
* **例子**：必要时给出举例，学术中称为one-shot learning，few-shot learning 或 in-context learning，实践证明其对输出正确性游很大帮助
* **输入**：任务的输入信息，在提示词中明确的标识出输入
* **输出**：输出的格式描述，以便后续模块自动解析模型的输出结果，比如JSON、XML

##### 2.1 定义角色为什么有效

大模型对prompt开头和结尾的内容更敏感

先定义角色，其实就是在开头把问题域收窄，减少二义性

##### 2.2 推荐流量包的智能客服

某运营商的流量包产品：

|   名称   | 流量(G/月) | 价格(元/月) | 适用人群 |
| :------: | :--------: | :---------: | :------: |
| 经济套餐 |     10     |     50      |  无限制  |
| 畅游套餐 |    100     |     180     |  无限制  |
| 无限套餐 |    1000    |     300     |  无限制  |
| 校园套餐 |    200     |     150     |  在校生  |

需求：智能客服根据用户的咨询，推荐最适合的流量包

核心思路：

* 把输入的自然语言对话，转成结构化的表示
* 从结构化的表示，生成策略
* 把策略转成自然语言输出

Prompt实现

用逐步调优的方式实现。先搭建基本运行环境

