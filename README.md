# AI工艺生成器 - 部署指南

## 项目结构

```
pilaoban-website/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 前端脚本
├── vercel.json         # Vercel配置
├── api/                # API路由
│   ├── generate.js     # AI生成API
│   └── contact.js      # 联系表单API
└── .env.example        # 环境变量示例
```

## 部署步骤

### 1. 准备工作

- 注册 [Vercel](https://vercel.com) 账号
- 注册 [OpenAI](https://platform.openai.com) 账号并获取API Key
- 安装 [Vercel CLI](https://vercel.com/download)（可选）

### 2. 部署到Vercel

#### 方式一：通过Git部署（推荐）

1. 创建GitHub仓库
```bash
cd /Users/mac/Documents/pilaoban-website
git init
git add .
git commit -m "Initial commit"
```

2. 在GitHub创建新仓库，然后推送
```bash
git remote add origin https://github.com/你的用户名/pilaoban-website.git
git push -u origin main
```

3. 在Vercel导入项目
- 登录Vercel
- 点击 "Add New Project"
- 选择GitHub仓库
- 配置环境变量（见下文）
- 点击Deploy

#### 方式二：通过Vercel CLI部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd /Users/mac/Documents/pilaoban-website
vercel

# 按照提示操作
```

### 3. 配置环境变量

在Vercel Dashboard中，进入项目设置 → Environment Variables，添加：

```
OPENAI_API_KEY=sk-你的OpenAI API Key
```

### 4. 绑定自定义域名

1. 在Vercel Dashboard中，进入项目设置 → Domains
2. 添加域名：`pilaoban.xin`
3. 按照提示配置DNS记录

#### DNS配置示例（以常见域名商为例）：

**类型：** CNAME
**名称：** @ 或 www
**值：** cname.vercel-dns.com

### 5. 验证部署

- 访问Vercel提供的临时域名（如 `pilaoban-xxx.vercel.app`）
- 测试上传图片和生成工艺单功能
- 确认无误后，访问你的域名 `pilaoban.xin`

## 费用说明

### Vercel（免费版）
- 每月100GB带宽
- 每月6000分钟构建时间
- 足够个人/小型项目使用

### OpenAI API
- GPT-4 Vision: $0.01-0.03 / 1K tokens
- 按实际使用量计费
- 需要绑定信用卡

## 注意事项

1. **API Key安全**：不要将OPENAI_API_KEY提交到Git仓库
2. **图片大小**：建议上传图片不超过2MB
3. **网络环境**：确保服务器能访问OpenAI API（可能需要代理）

## 后续优化

- [ ] 接入邮件服务（SendGrid/Resend）
- [ ] 添加用户认证
- [ ] 接入数据库保存历史记录
- [ ] 添加支付功能
- [ ] SEO优化

## 技术支持

如有问题，请联系：
- 微信：[你的微信号]
- 邮箱：[你的邮箱]
