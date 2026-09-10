# Easey 本地开发、GitHub 与 Vercel 指南

## 1. 安装工具

电脑需要安装：

- Visual Studio Code
- Node.js LTS
- Git
- 一个 GitHub 帐号

安装完成后重新打开 Visual Studio Code。

## 2. 在 Visual Studio Code 打开项目

1. 解压你下载的 Easey ZIP 文件。
2. 将资料夹改名为 `easey`。
3. 打开 Visual Studio Code。
4. 选择 **File -> Open Folder**。
5. 选择刚才的 `easey` 资料夹。
6. 选择 **Terminal -> New Terminal**。

在 Terminal 输入：

```bash
npm install
npm run dev
```

按住 `Ctrl` 并点击 Terminal 显示的本地网址。修改代码后网页会自动更新。

停止开发服务器时，在 Terminal 按 `Ctrl + C`。

## 3. 建立全新的 GitHub repository

1. 登入 GitHub。
2. 点击右上角 `+`，选择 **New repository**。
3. Repository name 输入 `easey`。
4. 选择 Private 或 Public。
5. 不要勾选 README、`.gitignore` 或 licence，因为项目里已经有这些文件。
6. 点击 **Create repository**。

回到 Visual Studio Code 的 Terminal，逐行输入：

```bash
git init
git add .
git commit -m "Initial Easey prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/easey.git
git push -u origin main
```

将 `YOUR_USERNAME` 换成你的 GitHub username。第一次 push 时，Visual Studio Code 或浏览器可能会要求你登入 GitHub。

## 4. 邀请组员

1. 打开 GitHub 的 `easey` repository。
2. 进入 **Settings -> Collaborators**。
3. 选择 **Add people**。
4. 输入组员的 GitHub username 或 email。

组员接受邀请后，可以使用：

```bash
git clone https://github.com/YOUR_USERNAME/easey.git
cd easey
npm install
npm run dev
```

## 5. 每次修改后的 GitHub 操作

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

开始修改前先同步最新版本：

```bash
git pull
```

## 6. 部署到 Vercel

1. 使用 GitHub 登入 Vercel。
2. 选择 **Add New -> Project**。
3. 找到并 Import `easey` repository。
4. 保留 Vercel 自动检测的设置。
5. 点击 **Deploy**。

此 prototype 不需要 environment variables。以后每次 push 到 GitHub，Vercel 会自动部署最新版本。

## 7. 提交前检查

```bash
npm run lint
npm run build
```

最后使用 Incognito/Private 窗口打开 Vercel 链接，并走完：

```text
82% Dashboard -> Hidden Load -> 113% Sandbox -> Action Plan -> Boundary Assistant -> 84% After State
```

演示时不要只点页面。请在 **Scenario Lab** 拖动 duration、切换 mental effort 或 deadline，让评审看到分数和图表会即时改变；之后按 **Reset judge demo** 回到标准的 82% → 113% → 84% 故事。
