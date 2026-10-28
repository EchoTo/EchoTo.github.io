---
title: '单调栈,单调队列,Trie'
date: 2022-02-17 11:28:57
tags: [单调栈,单调队列,Trie]
categories: 数据结构
---

## 单调栈

------

在普通栈的基础上，栈内元素维护一个单调性

#### 例题：

> 给定一个长度为 N 的整数数列，输出每个数左边第一个比它小的数，如果不存在则输出 −1。
>
> #### 输入格式
>
> 第一行包含整数 N，表示数列长度。
>
> 第二行包含 N 个整数，表示整数数列。
>
> #### 输出格式
>
> 共一行，包含 N 个整数，其中第 i 个数表示第 i 个数的左边第一个比它小的数，如果不存在则输出 1。
>
> #### 数据范围
>
> 1≤N≤10^5
> 1≤数列中元素≤10^9
>
> #### 输入样例：
>
> ```
> 5
> 3 4 2 7 5
> ```
>
> #### 输出样例：
>
> ```
> -1 3 -1 2 2
> ```

```java
import java.util.Scanner;

public class Main {
    static int N = (int)1e5 + 10;
    static int stk[] = new int[N];
    static int tt;
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        while (n -- != 0){
            int x = sc.nextInt();

            while (tt != 0 && stk[tt] >= x) tt --;
            if (tt == 0) System.out.print(-1 + " ");
            else System.out.print(stk[tt] + " ");

            stk[++ tt] = x;
        }

        sc.close();
    }
}
```

----

## 单调队列

---

在普通队列的基础上，队内元素维护一个单调性，**解决滑动窗口问题**

#### 例题：

> 给定一个大小为 n≤10^6 的数组。
>
> 有一个大小为 k 的滑动窗口，它从数组的最左边移动到最右边。
>
> 你只能在窗口中看到 k 个数字。
>
> 每次滑动窗口向右移动一个位置。
>
> 以下是一个例子：
>
> 该数组为 `[1 3 -1 -3 5 3 6 7]`，k 为 3。
>
> | 窗口位置            | 最小值 | 最大值 |
> | :------------------ | :----- | :----- |
> | [1 3 -1] -3 5 3 6 7 | -1     | 3      |
> | 1 [3 -1 -3] 5 3 6 7 | -3     | 3      |
> | 1 3 [-1 -3 5] 3 6 7 | -3     | 5      |
> | 1 3 -1 [-3 5 3] 6 7 | -3     | 5      |
> | 1 3 -1 -3 [5 3 6] 7 | 3      | 6      |
> | 1 3 -1 -3 5 [3 6 7] | 3      | 7      |
>
> 你的任务是确定滑动窗口位于每个位置时，窗口中的最大值和最小值。
>
> #### 输入格式
>
> 输入包含两行。
>
> 第一行包含两个整数 n 和 k，分别代表数组长度和滑动窗口的长度。
>
> 第二行有 n 个整数，代表数组的具体数值。
>
> 同行数据之间用空格隔开。
>
> #### 输出格式
>
> 输出包含两个。
>
> 第一行输出，从左至右，每个位置滑动窗口中的最小值。
>
> 第二行输出，从左至右，每个位置滑动窗口中的最大值。
>
> #### 输入样例：
>
> ```
> 8 3
> 1 3 -1 -3 5 3 6 7
> ```
>
> #### 输出样例：
>
> ```
> -1 -3 -3 -3 3 3
> 3 3 5 5 6 7
> ```

```java
import java.util.Scanner;

public class Main {
    static int N = (int)1e6 + 10;
    static int q[] = new int[N];
    static int w[] = new int[N];
    static int n,m;
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        m = sc.nextInt();

        for (int i = 0; i < n; i++) {
            w[i] = sc.nextInt();
        }

        int hh = 0,tt = -1;

        for (int i = 0; i < n; i++) {
            if (hh <= tt && i - q[hh] + 1 > m) hh ++;
            while (hh <= tt && w[i] <= w[q[tt]]) tt --;
            q[ ++ tt] = i;
            if (i >= m - 1) System.out.print(w[q[hh]] + " ");
        }
        System.out.println();
        hh = 0;tt = -1;

        for (int i = 0; i < n; i++) {
            if (hh <= tt && i - q[hh] + 1 > m) hh ++;
            while (hh <= tt && w[i] >= w[q[tt]]) tt --;
            q[ ++ tt] = i;
            if (i >= m - 1) System.out.print(w[q[hh]] + " ");
        }
        System.out.println();

        sc.close();
    }
}
```

-----

## Trie

----

**字典树：一个集合，一个高效存储和查找字符串的数据结构**

#### 例题：

> 维护一个字符串集合，支持两种操作：
>
> 1. `I x` 向集合中插入一个字符串 x；
> 2. `Q x` 询问一个字符串在集合中出现了多少次。
>
> 共有 N 个操作，输入的字符串总长度不超过 10^5，字符串仅包含小写英文字母。
>
> #### 输入格式
>
> 第一行包含整数 N，表示操作数。
>
> 接下来 N 行，每行包含一个操作指令，指令为 `I x` 或 `Q x` 中的一种。
>
> #### 输出格式
>
> 对于每个询问指令 `Q x`，都要输出一个整数作为结果，表示 x 在集合中出现的次数。
>
> 每个结果占一行。
>
> #### 数据范围
>
> 1≤N≤2∗10^4
>
> #### 输入样例：
>
> ```
> 5
> I abc
> Q abc
> Q ab
> I ab
> Q ab
> ```
>
> #### 输出样例：
>
> ```
> 1
> 0
> 1
> ```

```java
import java.util.Scanner;

public class Main {
    static int N = (int)1e5 + 10;
    static int s[][] = new int[N][26];
    static int count[] = new int[N];
    static int idx,n;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();

        while (n -- != 0){
            char op = sc.next().charAt(0);
            String a = sc.next();

            if (op == 'I') insert(a);
            else System.out.println(find(a));
        }

        sc.close();
    }
    public static void insert(String str){
        int p = 0;
        char[] chars = str.toCharArray();
        for (int i = 0; i < str.length(); i++) {
            int u = chars[i] - 'a';
            if (s[p][u] == 0) s[p][u] = ++ idx;
            p = s[p][u];
        }
        count[p] ++;
    }

    public static int find(String str){
        int p = 0;
        char[] chars = str.toCharArray();
        for (int i = 0; i < str.length(); i++) {
            int u = chars[i] - 'a';
            if (s[p][u] == 0) return 0;
            p = s[p][u];
        }
        return count[p];
    }
}
```
