#!/bin/bash
# 如何从命令后传递参数，在脚本中获取

echo "Shell 传递参数实例！";
echo "执行的文件名：$0";
echo "第一个参数为：$1";
echo "第二个参数为：$2";
echo "第三个参数为：$3";
echo "总的参数个数：$#";
echo "传递的参数：$*";
echo "当前进程 ID: $$";
