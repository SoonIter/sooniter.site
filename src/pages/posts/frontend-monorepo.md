---
title: 前端 monorepo 之殇
description: 前端 monorepo 存在哪些问题，怎么管理前端 monorepo ？
date: 2023-04-06
lang: zh
duration: 2s
image: frontend-monorepo/pnpm.png
---

在组里负责 monorepo 治理工具，来吐槽一下前端 monorepo 的现状

## 连环构建 和 拓扑排序

## 产物引入 和 源码引入

## 臭名昭著的 找不到包 Cannot found module

### 幻影依赖

### devDependencies

## 集中式依赖管理

### 一包一版本 —— Cargo

### 一包多版本 —— node_modules

### React 多实例, monorepo中的 dedupe，如何锁版本

## 发包

### changeset

### fixed 和 bumpp

## CI

### build 下游，test 上游
