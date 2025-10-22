---
title: 'KMP,并查集'
date: 2022-02-18 20:19:34
tags: [KMP,并查集]
categories: 数据结构
---

## KMP算法

---

**处理字符串匹配**

平时一般的想法就是打暴力，时间复杂度是**O(n * m)**

KMP算法将它优化为**O(n + m)**

#### 例题：

> 给定一个模式串 S，以及一个模板串 P，所有字符串中只包含大小写英文字母以及阿拉伯数字。
>
> 模板串 P 在模式串 S 中多次作为子串出现。
>
> 求出模板串 P 在模式串 S 中所有出现的位置的起始下标。
>
> #### 输入格式
>
> 第一行输入整数 N，表示字符串 P 的长度。
>
> 第二行输入字符串 P。
>
> 第三行输入整数 M，表示字符串 S 的长度。
>
> 第四行输入字符串 S。
>
> #### 输出格式
>
> 共一行，输出所有出现位置的起始下标（下标从 0 开始计数），整数之间用空格隔开。
>
> #### 数据范围
>
> 1≤N≤10^5
> 1≤M≤10^6
>
> #### 输入样例：
>
> ```
> 3
> aba
> 5
> ababa
> ```
>
> #### 输出样例：
>
> ```
> 0 2
> ```

```java
import java.util.Scanner;

public class Main {
    static int N = (int)1e5 + 10;
    static int M = (int)1e6 + 10;
    static int ne[] = new int[N];
    static char s1[] = new char[N];
    static char s2[] = new char[M];

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String P = sc.next();
        int m = sc.nextInt();
        String S = sc.next();
        char[] chars = P.toCharArray();
        char[] chars1 = S.toCharArray();
//      以下两个for循环为了让char数组从1开始存，方便之后处理ne数组。
//      有人知道简单方式请告诉我，俩for循环就很难受
        for (int i = 0; i < chars.length; i ++) {
            s1[i + 1] = chars[i];
        }
        for (int i = 0; i < chars1.length; i ++) {
            s2[i + 1] = chars1[i];
        }

        for (int i = 2, j = 0; i <= n; i ++) {
            while (j != 0 && s1[j + 1] != s1[i]) j = ne[j];
            if (s1[j + 1] == s1[i]) j ++;
            ne[i] = j;
        }

        for (int i = 1, j = 0; i <= m; i ++) {
            while (j != 0 && s1[j + 1] != s2[i]) j = ne[j];
            if (s1[j + 1] == s2[i]) j ++;
            if (j == n){
                System.out.println(i - j);
                j = ne[j];
            }
        }
        
        sc.close();
    }
}
```

--------

## 并查集

---

**合并集合，询问两个元素是否在一个集合中**

#### 例题：

> 一共有 n 个数，编号是 1∼n，最开始每个数各自在一个集合中。
>
> 现在要进行 m 个操作，操作共有两种：
>
> 1. `M a b`，将编号为 a 和 b 的两个数所在的集合合并，如果两个数已经在同一个集合中，则忽略这个操作；
> 2. `Q a b`，询问编号为 a 和 b 的两个数是否在同一个集合中；
>
> #### 输入格式
>
> 第一行输入整数 n 和 m。
>
> 接下来 m 行，每行包含一个操作指令，指令为 `M a b` 或 `Q a b` 中的一种。
>
> #### 输出格式
>
> 对于每个询问指令 `Q a b`，都要输出一个结果，如果 a 和 b 在同一集合内，则输出 `Yes`，否则输出 `No`。
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
> 4 5
> M 1 2
> M 3 4
> Q 1 2
> Q 1 3
> Q 3 4
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
    static int p[] = new int[N];

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            p[i] = i;
        }
        while (m -- != 0){
            char op = sc.next().charAt(0);
            int a = sc.nextInt();
            int b = sc.nextInt();
            if (op == 'M') p[find(a)] = find(b);
            else {
                if (find(a) == find(b)) System.out.println("Yes");
                else System.out.println("No");
            }
        }
        sc.close();
    }

    public static int find(int x){
        if (p[x] != x) p[x] = find(p[x]);
        return p[x];
    }
}
```
