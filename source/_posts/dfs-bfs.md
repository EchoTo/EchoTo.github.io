---
title: 'dfs,bfs'
date: 2022-02-22 18:25:05
tags: [dfs,bfs]
categories: 搜索
---

## dfs(深度优先搜索)

--------

​        Depth-First-Search，DFS是一种用于遍历或搜索树或图的算法。这个算法会尽可能深的搜索树的分支。当节点v的所在边都己被探寻过，搜索将回溯到发现节点v的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。如果还存在未被发现的节点，则选择其中一个作为源节点并重复以上过程，整个进程反复进行直到所有节点都被访问为止。

**演算方法**

1. 首先将根节点放入stack中。

2. 从stack中取出第一个节点，并检验它是否为目标。

3. 重复步骤2。

4. 如果不存在未检测过的直接子节点。

   * 将上一级结点加入stack中

   * 重复步骤2

5. 重复步骤4。

6. 若stack为空，表示整张图都检查过了——亦即图中没有欲搜寻的目标。结束搜寻并回传“找不到目标”。

**时间复杂度**

平均时间复杂度为O(b^m^)     b：分支系数(是每个结点下的子结点数，即出度)    m：图的最大深度

### 例题：

> 给定一个整数 n，将数字 1∼n 排成一排，将会有很多种排列方法。
>
> 现在，请你按照字典序将所有的排列方法输出。
>
> #### 输入格式
>
> 共一行，包含一个整数 n。
>
> #### 输出格式
>
> 按字典序输出所有排列方案，每个方案占一行。
>
> #### 数据范围
>
> 1≤n≤7
>
> 输入样例：
>
> ```
> 3
> ```
>
> #### 输出样例：
>
> ```
> 1 2 3
> 1 3 2
> 2 1 3
> 2 3 1
> 3 1 2
> 3 2 1
> ```

```java
import java.util.Scanner;

public class Main {
    static int N = 10;
    static boolean st[] = new boolean[N];
    static int path[] = new int[N];

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        dfs(0,n);
    }

    private static void dfs(int u,int n){
        if (u == n){
            for (int i = 0; i < n; i++) {
                System.out.print(path[i] + " ");
            }
            System.out.println();
            return;
        }
        for (int i = 1; i <= n; i++) {
            if (!st[i]){
                st[i] = true;
                path[u] = i;
                dfs(u + 1,n);
                st[i] = false;
            }
        }
    }
}
```

--------

## bfs(广度优先搜索)

------

​        Breadth-First Search，BFS，又译作**宽度优先搜索**，或**横向优先搜索**，是一种图形搜索算法。简单的说，BFS是从根节点开始，沿着树的宽度遍历树的节点。如果所有节点均被访问，则算法中止。广度优先搜索的实现一般采用open-closed表。

​         从算法的观点，所有因为展开节点而得到的子节点都会被加进一个先进先出的队列中。一般的实现里，其邻居节点尚未被检验过的节点会被放置在一个被称为 *open* 的容器中（例如队列或是链表），而被检验过的节点则被放置在被称为 *closed* 的容器中。（open-closed表）

**实现方法**

1. 首先将根节点放入队列中。
2. 从队列中取出第一个节点，并检验它是否为目标。
   - 如果找到目标，则结束搜索并回传结果。
   - 否则将它所有尚未检验过的直接子节点加入队列中。
3. 若队列为空，表示整张图都检查过了——亦即图中没有欲搜索的目标。结束搜索并回传“找不到目标”。
4. 重复步骤2。

**时间复杂度**

​        最差情形下，BFS必须查找所有到可能节点的所有路径，因此其时间复杂度为O(|V| + |E|)，其中|V|是节点的数目，|E|是图中边的数目。

### 例题：

### 最短路径问题

> 给定一个 n×m 的二维整数数组，用来表示一个迷宫，数组中只包含 0 或 1，其中 0 表示可以走的路，1 表示不可通过的墙壁。
>
> 最初，有一个人位于左上角 (1,1) 处，已知该人每次可以向上、下、左、右任意一个方向移动一个位置。
>
> 请问，该人从左上角移动至右下角 (n,m) 处，至少需要移动多少次。
>
> 数据保证 (1,1) 处和 (n,m) 处的数字为 0，且一定至少存在一条通路。
>
> #### 输入格式
>
> 第一行包含两个整数 n 和 m。
>
> 接下来 n 行，每行包含 m 个整数（0 或 1），表示完整的二维数组迷宫。
>
> #### 输出格式
>
> 输出一个整数，表示从左上角移动至右下角的最少移动次数。
>
> #### 数据范围
>
> 1≤n,m≤100
>
> #### 输入样例：
>
> ```
> 5 5
> 0 1 0 0 0
> 0 1 0 1 0
> 0 0 0 0 0
> 0 1 1 1 0
> 0 0 0 1 0
> ```
>
> #### 输出样例：
>
> ```
> 8
> ```

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    static int N = 110;
    static int g[][] = new int[N][N];
    static int d[][] = new int[N][N];
    static PII q[] = new PII[N * N];
    static int n,m;

    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        String[] str1 = bufferedReader.readLine().split(" ");
        n = Integer.parseInt(str1[0]);
        m = Integer.parseInt(str1[1]);
        for (int i = 0; i < n; i++) {
            String[] str = bufferedReader.readLine().split(" ");
            for (int j = 0; j < m; j++) {
                g[i][j] = Integer.parseInt(str[j]);
            }
        }
        System.out.println(bfs());

        bufferedReader.close();
    }

    private static int bfs(){
        int hh = 0,tt = 0;
        q[0] = new PII(0,0);
        for (int i = 0; i < d.length; i++) {
            for (int j = 0; j < d[i].length; j++) {
                d[j][i] = -1;
            }
        }
        d[0][0] = 0;
        int dx[] = {-1,0,1,0};int dy[] = {0,1,0,-1};
        while (hh <= tt){
            PII t = q[hh ++];
            for (int i = 0; i < 4; i++) {
                int x = t.getFirst() + dx[i], y = t.getSecond() + dy[i];
                if (x >= 0 && x < n && y >= 0 && y < m && g[x][y] == 0 && d[x][y] == -1){
                    d[x][y] = d[t.getFirst()][t.getSecond()] + 1;
                    q[ ++ tt] = new PII(x,y);
                }
            }
        }
        return d[n - 1][m - 1];
    }
}

class PII{
    private int first;
    private int second;

    public PII(int first, int second) {
        this.first = first;
        this.second = second;
    }

    public int getFirst() {
        return first;
    }

    public int getSecond() {
        return second;
    }
}
```

----------

### 最小步数问题

-----

> 在一个 3×3 的网格中，1~8 这 8 个数字和一个 `x` 恰好不重不漏地分布在这 3×3 的网格中。
>
> 例如：
>
> ```
> 1 2 3
> x 4 6
> 7 5 8
> ```
>
> 在游戏过程中，可以把 `x` 与其上、下、左、右四个方向之一的数字交换（如果存在）。
>
> 我们的目的是通过交换，使得网格变为如下排列（称为正确排列）：
>
> ```
> 1 2 3
> 4 5 6
> 7 8 x
> ```
>
> 例如，示例中图形就可以通过让 `x` 先后与右、下、右三个方向的数字交换成功得到正确排列。
>
> 交换过程如下：
>
> ```
> 1 2 3   1 2 3   1 2 3   1 2 3
> x 4 6   4 x 6   4 5 6   4 5 6
> 7 5 8   7 5 8   7 x 8   7 8 x
> ```
>
> 现在，给你一个初始网格，请你求出得到正确排列至少需要进行多少次交换。
>
> #### 输入格式
>
> 输入占一行，将 3×3 的初始网格描绘出来。
>
> 例如，如果初始网格如下所示：
>
> ```
> 1 2 3 
> x 4 6 
> 7 5 8 
> ```
>
> 则输入为：`1 2 3 x 4 6 7 5 8`
>
> #### 输出格式
>
> 输出占一行，包含一个整数，表示最少交换次数。
>
> 如果不存在解决方案，则输出 −1。
>
> #### 输入样例：
>
> ```
> 2  3  4  1  5  x  7  6  8
> ```
>
> #### 输出样例
>
> ```
> 19
> ```

```java
import java.util.*;

public class Main{
    static Map<String, Integer> map = new HashMap<>();

    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String str = "";

        for (int i = 0; i < 9; i ++){
            str += sc.next();
        }

        System.out.print(bfs(str));
    }

    private static int bfs(String str){

        int[] dx = {0, 1, 0, -1};
        int[] dy = {1, 0, -1, 0};

        Queue<String> q = new LinkedList<>();

        q.add(str);
        map.put(str, 0);

        while (!q.isEmpty()){

            String t = q.remove();

            if (t.equals("12345678x")) return map.get(t);

            int pos = t.indexOf('x');

            int x = pos / 3;
            int y = pos % 3;

            for (int i = 0; i < 4; i ++){
                int tx = x + dx[i];
                int ty = y + dy[i];

                if (tx < 0 || tx >= 3 || ty < 0 || ty >= 3) continue;
                String tstr = makeStr(t, pos, tx * 3 + ty);
                if (map.containsKey(tstr)) continue;

                map.put(tstr, map.get(t) + 1);
                q.add(tstr);
            }
        }

        return -1;
    }

    private static String makeStr(String t, int src, int dest){
        StringBuilder str = new StringBuilder(t);
        str.setCharAt(src, t.charAt(dest));
        str.setCharAt(dest, 'x');

        return str.toString();
    }
}
```

----------

## 树和图的BFS和DFS

--------

#### 例题：

### 树的遍历

> 给定一颗树，树中包含 n 个结点（编号 1∼n）和 n−1 条无向边。
>
> 请你找到树的重心，并输出将重心删除后，剩余各个连通块中点数的最大值。
>
> 重心定义：重心是指树中的一个结点，如果将这个点删除后，剩余各个连通块中点数的最大值最小，那么这个节点被称为树的重心。
>
> #### 输入格式
>
> 第一行包含整数 n，表示树的结点数。
>
> 接下来 n−1 行，每行包含两个整数 a 和 b，表示点 a 和点 b 之间存在一条边。
>
> #### 输出格式
>
> 输出一个整数 m，表示将重心删除后，剩余各个连通块中点数的最大值。
>
> #### 数据范围
>
> 1≤n≤10^5
>
> #### 输入样例
>
> ```
> 9
> 1 2
> 1 7
> 1 4
> 2 8
> 2 5
> 4 3
> 3 9
> 4 6
> ```
>
> #### 输出样例：
>
> ```
> 4
> ```

```java
import java.io.*;

public class Main {
    static int N = (int)1e5 + 10;
    static int h[] = new int[N];
    static int e[] = new int[2 * N];
    static int ne[] = new int[2 * N];
    static boolean st[] = new boolean[N];
    static int n,ans = N;
    static int idx = 0;

    public static void main(String[] args) throws IOException {
        StreamTokenizer streamTokenizer = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(System.out));
        
        streamTokenizer.nextToken();
        n = (int)streamTokenizer.nval;

        init();

        int a,b;
        for (int i = 1; i < n; i++) {
            streamTokenizer.nextToken();a = (int)streamTokenizer.nval;
            streamTokenizer.nextToken();b = (int)streamTokenizer.nval;

            add(a,b);add(b,a);
        }
        dfs(1);

        bufferedWriter.write(ans + "");
        bufferedWriter.close();
    }

    private static void init(){
        for (int i = 1; i <= n; ++ i) {
            h[i] = -1;
        }
    }

    private static void add(int a,int b){
        e[idx] = b;
        ne[idx] = h[a];
        h[a] = idx ++;
    }

    private static int dfs(int u){
        int size = 0;
        st[u] = true;
        int sum = 0;

        for (int i = h[u]; i != -1 ; i = ne[i]) {
            int j = e[i];
            if (!st[j]){
                int s = dfs(j);
                size = Math.max(size,s);
                sum += s;
            }
        }

        size = Math.max(size,n - sum - 1);
        ans = Math.min(ans,size);

        return sum + 1;
    }
}
```

---------

### 图的遍历

> 给定一个 n 个点 m 条边的有向图，图中可能存在重边和自环。
>
> 所有边的长度都是 1，点的编号为 1∼n。
>
> 请你求出 1 号点到 n 号点的最短距离，如果从 1 号点无法走到 n 号点，输出 −1。
>
> #### 输入格式
>
> 第一行包含两个整数 n 和 m。
>
> 接下来 m 行，每行包含两个整数 a 和 b，表示存在一条从 a 走到 b 的长度为 1 的边。
>
> #### 输出格式
>
> 输出一个整数，表示 1 号点到 n 号点的最短距离。
>
> #### 数据范围
>
> 1≤n,m≤10^5
>
> #### 输入样例：
>
> ```
> 4 5
> 1 2
> 2 3
> 3 4
> 1 3
> 1 4
> ```
>
> #### 输出样例：
>
> ```
> 1
> ```

```java
package S03_DFS_BFS;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

public class S05_Tu {
    static int N = (int)1e5 + 10;
    static int idx = 0;
    static int n,m;
    static int h[] = new int[N];
    static int e[] = new int[N];
    static int ne[] = new int[N];
    static int d[] = new int[N];
    static int q[] = new int[N];

    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        String[] s = bufferedReader.readLine().split(" ");

        n = Integer.parseInt(s[0]);
        m = Integer.parseInt(s[1]);
        
        Arrays.fill(h,-1);

        while (m -- > 0){
            String[] s1 = bufferedReader.readLine().split(" ");
            int x = Integer.parseInt(s1[0]);
            int y = Integer.parseInt(s1[1]);
            add(x,y);
        }

        System.out.println(bfs());

        bufferedReader.close();
    }

    private static int bfs(){
        int hh = 0, tt = 0;
        q[0] = 1;
        Arrays.fill(d,-1);

        d[1] = 0;
        while (hh <= tt){
            int t = q[hh ++];

            for (int i = h[t]; i != -1; i = ne[i]) {
                int j = e[i];
                if (d[j] == -1){
                    d[j] = d[t] + 1;
                    q[++ tt] = j;
                }
            }
        }

        return d[n];
    }

    private static void add(int x,int y){
        e[idx] = y;
        ne[idx] = h[x];
        h[x] = idx ++;
    }
}
```
