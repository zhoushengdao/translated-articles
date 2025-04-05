# 调试至黎明：Git Bisect 如何拯救了我的演示

> 一夜之旅，Git Bisect 在关键演示前几小时帮助定位了一个关键错误。

> 2024 年 8 月 31 日

![](https://www.mikebuss.com/_next/image?url=%2Fimages%2Fposts%2Fdebugging-till-dawn%2Fcover.jpg&w=2048&q=75)

那是星期一的凌晨 2 点。在我必须进行的演示前 7 小时，我疯狂地排查一个错误。我无论如何也想不出为什么会出现这个问题。但是，我知道一件事：这个错误在之前的版本中不存在。

项目由两个组件组成：一个运行我用 C 编写的固件的设备，和一个我用 Swift 编写的 iPadOS 应用程序。我相当确定错误存在于固件端。

![](https://www.mikebuss.com/_next/image?url=%2Fimages%2Fposts%2Fdebugging-till-dawn%2Fdevices.jpg&w=1920&q=75)

在正常工作版本和有错误的版本之间有超过 100 个提交，所以并不立即清楚是什么更改导致了错误。

那时我想起了 **git bisect**。这个命令使用二分搜索算法帮助精确定位引入错误的提交。是时候让它发挥作用了。

---gif---

我首先将当前的 HEAD 标记为"bad"，将最后一个已知的好提交标记为"good"：

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
```

Git 然后检出了这两个点之间的中间提交。这就是二分搜索的魔力所在。不是逐个检查每个提交，这在有超过 100 个提交需要筛选的情况下会花费很长时间，**git bisect** 策略性地选择提交进行测试，每次迭代都将搜索空间减半。

幸运的是，这是一个我可以通过脚本验证的错误。因此，我添加了一个脚本来检查错误是否存在，并让 **git bisect** 为每个提交运行测试。

```bash
git bisect run ./test_for_bug.sh
```

然后它就开始了！Git 检出不同的提交，运行我的脚本，并缩小搜索范围。

几秒钟后，Git 宣布：

```bash
b1f3d2c is the first bad commit
commit b1f3d2c5e8a9f0d4c3b2a1098765432100fedcba
Author: Mike Buss <mike@mikebuss.com>
Date: Fri Jun 9 11:23:45 2024 -0700

    Added a feature that definitely won’t break anything （添加了一个绝对不会破坏任何东西的功能）
```

找到了罪魁祸首。结果发现，在我热切尝试优化内存使用时，我在传感器数据处理例程中引入了一个微妙的错误。优化在大多数情况下工作良好，但在特定条件下失败——正是我的演示场景中存在的条件。

随着有问题的提交被识别，修复错误变得容易多了。我能够专注于导致问题的确切更改并进行必要的修正。

到了凌晨 5 点，距离我的演示还有四个小时，错误被修复了。

这次经历强化了一个宝贵的教训：了解你的工具和了解你的代码一样重要。 **git bisect** 将可能是几个小时的手动调试变成了一个命令。

在代码的广阔森林中，正确的工具可以是你的指南针。记住 **git bisect** 的力量——它可能只是你在下一次调试冒险中需要的生命线。
