/**
 * 简体中文. Machine-assisted, needs native review (see docs/I18N.md).
 * macOS labels from Apple's zh-cn support page mh40616.
 */
import { links, site } from "@/site.config";
import { build } from "../build";

const macos = "macOS 14 Sonoma 或更高版本";

export const zh = build({
  locale: "zh",
  seo: {
    title: "Vermut：在 Mac 上用 Steam、GOG 和 Epic 玩 Windows 游戏",
    description:
      "适用于 Apple 芯片 Mac 的免费开源启动器。Vermut 安装 Steam 和 GOG Galaxy，添加 Epic Games（测试版），配置 Wine，并启动你的 Windows 游戏。",
    keywords: ["Mac 玩 Windows 游戏", "Steam Mac Apple 芯片", "Epic Games Mac", "GOG Galaxy Mac", "Wine macOS", "Whisky 替代", "CrossOver 替代", "免费开源 Mac 游戏启动器", "Vermut"],
  },
  nav: ["使用方法", "兼容性", "对比", "支持我们", "常见问题", "下载"],
  hero: {
    eyebrow: "免费 · 开源 · Apple 芯片",
    lead: "Vermut 在你的 Mac 上安装 Steam 和 GOG Galaxy，添加你的 Epic Games 游戏库（测试版），并为每个平台配置 Wine，点一下即可启动 Windows 游戏。",
    primary: "下载 Mac 版",
    secondary: "在 GitHub 上加星",
    meta: [macos, "Apple 芯片", `${site.license} 许可证`],
    screenshotAlt:
      "Vermut 的 Library 界面：一款 Steam 游戏标记为 Ready，并有 Play 按钮。边栏列出 Stores、Library、Downloads，以及 Steam、Epic Games 和 GOG Galaxy 各自的容器。",
  },
  howItWorks: {
    eyebrow: "使用方法",
    title: "三步搞定，无需终端。",
    lead: "无需配置容器，无需挑选 Wine 版本，也无需命令行。下面每段视频都是真实的应用画面。",
    steps: [
      {
        title: "选择商店",
        body: "选择 Steam、GOG Galaxy 或 Epic Games（测试版）。Steam 和 GOG 使用官方安装程序；Epic 通过开源客户端 Legendary 接入，无需 Epic 启动器。每个商店都有独立的容器，互不干扰。",
        description: "屏幕录制：Stores 界面列出 Steam、Epic Games（测试版）和 GOG Galaxy，各自安装在独立的容器中。指针依次划过各商店，然后点按 Open Steam。",
      },
      {
        title: "Vermut 配置 Wine",
        body: "每个容器都会获得 Wine 11 以及适合其商店的图形层：Steam 用 DXMT，Epic 用 DXVK，GOG 用 WineD3D。之后可以更改，但通常不需要。",
        description: "屏幕录制：指针从边栏打开 Steam 容器，切换到 Graphics 标签页，并指向当前选中的后端 DXMT。",
      },
      {
        title: "开玩",
        body: "像平常一样登录商店并安装游戏。游戏会出现在 Library 中，点按 Play 即可在正确的容器中启动。",
        description: "屏幕录制：指针打开 Library，其中一款 Steam 游戏标记为 Ready，然后点按 Continue 栏中的 Play。",
      },
    ],
  },
  compatibility: {
    eyebrow: "兼容性，实话实说",
    title: "哪些能玩，哪些不能。",
    lead: "Vermut 通过 Wine 运行 Windows 游戏。很多游戏运行良好，也有一些永远无法运行。与其让你下载 60 GB 之后才发现，不如现在就说清楚。",
    groups: [
      {
        title: "通常可以运行",
        items: [
          ["DirectX 9、10 和 11 游戏，由 DXMT 或 DXVK 转译为 Metal。"],
          ["独立游戏和较老的游戏，通常最容易成功。"],
          ["Steam 和 GOG Galaxy 客户端本身，以及通过 Legendary（测试版）接入的 Epic Games 游戏库。"],
        ],
      },
      {
        title: "需要一些设置",
        items: [
          ["DirectX 12 游戏需要 Apple 的 ", { text: "Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" }, "（D3DMetal）。安装后 Vermut 会自动检测，但绝不会内置它。"],
          ["自带启动器的游戏（如 EA app 或 Ubisoft Connect）可能需要在容器中使用 Run .exe，并多试几次。"],
        ],
      },
      {
        title: "无法运行",
        items: [
          ["使用内核级反作弊的游戏，包括 Valorant、Fortnite 和 Call of Duty。反作弊会拦截 Wine，Mac 端无能为力。"],
          ["任何需要 Windows 驱动程序的软件，例如部分外设工具或 DRM 工具。"],
        ],
      },
    ],
    footnote: [
      "购买游戏前，请在 ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " 查看反作弊状态，并在 ",
      { text: "CodeWeavers 兼容性数据库", href: "https://www.codeweavers.com/compatibility" },
      " 查看 Mac 上的 Wine 运行报告。",
    ],
  },
  comparison: {
    eyebrow: "对比",
    title: "Vermut 的定位。",
    lead: "在 Mac 上玩 Windows 游戏有不少好办法。以下是截至 2026 年 10 月的区别。",
    rows: [
      { label: "价格", cells: [["免费"], ["免费"], ["74 美元起", "含 12 个月更新；14 天免费试用 [3][4]"], ["免费"]] },
      { label: "开源", cells: [["是，MIT"], ["是，GPL-3.0 [2]"], ["否", "基于 Wine（LGPL）"], ["是，GPL-3.0 [6]"]] },
      { label: "持续维护", cells: [["是"], ["否", "2025 年 4 月 9 日归档；社区分支仍在继续 [1][2]"], ["是", "CrossOver 26，2026 年 2 月 [5]"], ["是", "v2.22.4，2026 年 10 月 15 日 [7]"]] },
      {
        label: "自动配置 Steam、Epic 和 GOG",
        cells: [
          ["是", "Steam 和 GOG 各有独立容器；Epic（测试版）通过 Legendary，无需 Epic 启动器"],
          ["否", "需自行创建容器并运行各安装程序"],
          ["是", "来自其安装目录；CrossOver 25 起支持 Epic 和 GOG [9][10]"],
          ["Epic、GOG、Amazon", "自有启动器；不含 Steam 客户端 [6]"],
        ],
      },
      {
        label: "Wine 引擎",
        cells: [
          ["内置", "Wine 11，含 DXMT 和 DXVK；安装后可用 D3DMetal"],
          ["内置，已停更", "不会升级到 Wine 8 及以上 [1]"],
          ["内置", "CodeWeavers 自有版本"],
          ["自选", "下载 Wine、GPTK 版本或使用 CrossOver [8]"],
        ],
      },
      { label: "无需终端", cells: [["是"], ["是"], ["是"], ["是"]] },
      { label: "支持", cells: [["GitHub Issues"], ["无"], ["邮件和电话", "许可证有效期内 [3]"], ["社区", "GitHub 和 Discord"]] },
    ],
    aside: ["需要商业支持或最广泛的兼容性？请购买 CrossOver。CodeWeavers 是 Wine 最大的贡献者之一，包括 Vermut 在内的所有 Mac Wine 项目都建立在这份工作之上。"],
    sourcesTitle: "资料来源（2026 年 10 月 19 日核实）",
  },
  support: {
    eyebrow: "支持 Vermut",
    title: "免费，而且一直免费。",
    lead: "Vermut 是利用业余时间开发的。捐款用于支付这些时间，以及测试所用的 Mac 和游戏。无论如何都不会推出付费版。",
    donateLabel: "通过 PayPal 捐款",
    donateNote: "将在新标签页中打开 PayPal。",
    otherTitle: "不方便捐款？这些同样有帮助。",
    options: [
      { title: "在 GitHub 上加星", body: "星标能帮助更多 Mac 玩家发现这个项目。", label: "为仓库加星" },
      { title: "报告问题", body: "遇到故障？附上 macOS 版本和日志的 Issue 能帮我们修复。", label: "提交问题报告" },
      { title: "告诉我们哪些游戏能玩", body: "玩过什么游戏？无论能否运行，请发布游戏名、商店和图形后端。", label: "提交游戏报告" },
    ],
    share: { title: "分享 Vermut", body: "认识在 Mac 上玩游戏的朋友？把链接发给他们。", text: "Vermut：在 Mac 上用 Steam、GOG 和 Epic 玩 Windows 游戏。免费开源。" },
  },
  faq: {
    eyebrow: "常见问题",
    title: "问与答。",
    items: [
      { q: "Vermut 真的免费吗？", a: [`是的。采用 ${site.license} 许可证开源，无需账户，没有付费版，没有遥测。`] },
      { q: "支持 Intel 芯片的 Mac 吗？", a: ["不支持。Vermut 专为 Apple 芯片打造：M1 及之后的所有芯片。"] },
      { q: "需要哪个版本的 macOS？", a: [`${macos}。`] },
      { q: "我的游戏能运行吗？", a: ["取决于游戏。大多数 DirectX 9 至 11 的游戏可以；使用内核级反作弊的游戏不行。完整说明见", { text: "兼容性", href: "#compatibility" }, "部分。"] },
      { q: "Vermut 能看到我的 Steam 或 Epic 密码吗？", a: ["不能。Steam 和 GOG 在官方商店应用内登录，应用运行在各自的容器中。Epic（测试版）在 Epic 的登录页面登录，会话由 Legendary 保存在你的 Mac 上。"] },
      { q: "Vermut 会安装 Epic Games Launcher 吗？", a: ["不会。Epic 支持目前为测试版，使用开源 Epic 客户端 ", { text: "Legendary", href: "https://github.com/derrod/legendary" }, "：无需 Epic Games Launcher 即可登录、查看游戏库、安装和启动游戏。"] },
      { q: "是否内置 Apple 的 Game Porting Toolkit？", a: ["不内置，Vermut 绝不捆绑它。如果你自行安装，Vermut 会检测到并提供 D3DMetal 作为图形选项。"] },
      {
        q: "为什么 macOS 会显示警告？",
        a: [
          "Vermut 免费开源，没有使用付费的 Apple Developer ID 签名，也未经 Apple 公证，因此 Gatekeeper 无法为其担保。只需在“系统设置”›“隐私与安全”中允许一次（参见",
          { text: "首次打开步骤", href: "#download" },
          "）。你可以阅读",
          { text: "源代码", href: links.github },
          "，并将 DMG 的 SHA-256 与本页显示的值进行比对。",
        ],
      },
      { q: "需要终端或 Homebrew 吗？", a: ["不需要。从安装商店到启动游戏，一切都在应用内完成。"] },
      { q: "和 Whisky 有什么不同？", a: ["Whisky 是通用的 Wine 前端，已停止维护。Vermut 围绕游戏商店打造：每个商店一个容器并自动配置好，安装的所有游戏都集中在 Library 中。"] },
      { q: "如何卸载？", a: ["在 Vermut 中通过各容器的 Danger zone 删除容器（会移除该商店及其游戏），然后将 Vermut 拖到废纸篓。"] },
    ],
    requirements: {
      title: "系统要求",
      items: [
        { label: "Mac", value: "Apple 芯片（M1 或更新）" },
        { label: "macOS", value: "14 Sonoma 或更高版本" },
        { label: "磁盘", value: "10 GB 可用空间，另需游戏空间" },
        { label: "Rosetta 2", value: "若未安装将自动安装" },
        { label: "网络", value: "用于下载商店和游戏" },
      ],
    },
  },
  download: {
    eyebrow: "下载",
    title: "下载适用于 Mac 的 Vermut。",
    lead: "一个 DMG，直接来自 GitHub 最新发布版。免费，无需账户。",
    primaryLabel: (version) => `下载 Vermut ${version}（.dmg）`,
    shaLabel: "SHA-256",
    allReleases: "所有版本和发布说明",
    brewLabel: "或使用 Homebrew 安装",
    installTitle: "一分钟完成安装",
    steps: (dmgName) => [
      `从“下载”文件夹打开 ${dmgName}。`,
      "将 Vermut 拖到“应用程序”文件夹。",
      "从“应用程序”打开 Vermut。如果你的 Mac 缺少 Rosetta 2，Vermut 会为你安装。",
    ],
    gatekeeper: {
      title: "首次打开：允许 Vermut 一次",
      why: "Vermut 是免费开源应用，没有使用付费的 Apple Developer ID 签名，因此 macOS 会发出警告。你可以逐行阅读",
      whySource: "源代码",
      whyAnd: "，并用它的 ",
      whySha: "SHA-256",
      whyEnd: " 校验下载文件。",
      steps: [
        { title: "打开 Vermut", body: "在“应用程序”中连按 Vermut。macOS 会提示“Vermut”未打开。请点按“完成”，不要点按“移到废纸篓”。" },
        { title: "打开“隐私与安全”", body: "选取苹果菜单 >“系统设置”，点按边栏中的“隐私与安全”，然后向下滚动到“安全性”。" },
        { title: "点按“仍要打开”", body: "在关于 Vermut 的信息旁边，点按“仍要打开”。此按钮在第 1 步后约一小时内可用。" },
        { title: "确认", body: "点按“打开”，然后输入登录密码或使用触控 ID 确认。macOS 会记住你的选择，只需操作一次。" },
      ],
      note: "以上是 macOS 15 Sequoia 及更高版本的步骤，在这些版本中按住 Control 键点按 ›“打开”已无法跳过检查。在 macOS 14 Sonoma 上，按住 Control 键点按 ›“打开”仍然有效。",
      appleLabel: "Apple 支持：打开来自未知开发者的 Mac App",
      appleHref: "https://support.apple.com/zh-cn/guide/mac-help/mh40616/mac",
      illustrationNote: "简化示意图，并非截图。",
    },
    terminal: {
      title: "更喜欢终端？一条命令完成安装（不会出现 Gatekeeper 警告）",
      body: "脚本会下载最新的 DMG 并将 Vermut 拷贝到“应用程序”。运行前请先阅读脚本。",
      sourceLabel: "查看 install.sh 源代码",
    },
  },
  footer: {
    statement: "免费开源。无需账户，没有遥测，没有付费版。",
    cta: "下载 Mac 版",
    columns: [
      { title: "项目", links: ["GitHub", "版本发布", `${site.license} 许可证`, "品牌素材（.zip）"] },
      { title: "参与贡献", links: ["支持 Vermut", "贡献指南", "报告问题", "未解决的 Issue"] },
    ],
    legal: "Vermut 与 Valve、Epic Games、GOG、CodeWeavers 或 Apple 均无关联。Steam、Epic Games Store、GOG Galaxy 等名称是其各自所有者的商标。",
  },
  ui: {
    skipToContent: "跳到正文",
    primaryNav: "主导航",
    backToTop: "Vermut，返回顶部",
    releaseDetails: "版本详情",
    stepPrefix: (n) => `第 ${n} 步：`,
    videoLabel: (title) => `${title}：Vermut 屏幕录制`,
    play: (label) => `播放：${label}`,
    pause: (label) => `暂停：${label}`,
    compareCaption: "Vermut 与 Whisky、CrossOver 和 Heroic 的对比。方括号中的数字对应表格下方的资料来源。",
    feature: "项目",
    copied: "已拷贝",
    copySha: (file) => `拷贝 ${file} 的 SHA-256`,
    copyInstall: "拷贝安装命令",
    copyLink: "拷贝 Vermut 链接",
    opensNewTab: "（在新标签页中打开）",
    shareNewTab: "（分享，在新标签页中打开）",
    language: "语言",
    macosRequirement: macos,
    appleSilicon: "Apple 芯片（M1 或更新）",
    facts: { version: "版本", size: "大小", macos: "macOS", mac: "Mac", licence: "许可证" },
    version: (v) => `版本 ${v}`,
    latest: "最新",
    releaseNotes: (v) => `Vermut ${v} 发布说明`,
    licence: (l) => `${l} 许可证`,
  },
  illustrations: {
    note: "简化示意图，并非截图。",
    dialog: {
      aria: "macOS 提示“Vermut”未打开的示意图，带有“完成”和“移到废纸篓”按钮。请点按“完成”。",
      title: "“Vermut”未打开",
      body: "Apple 无法验证“Vermut”是否包含可能危害 Mac 安全或泄漏隐私的恶意软件。",
      trash: "移到废纸篓",
      done: "完成",
    },
    settings: {
      aria: "“系统设置”中“隐私与安全”的“安全性”部分示意图：显示 Vermut 已被阻止的信息和“仍要打开”按钮。",
      window: "隐私与安全",
      section: "安全性",
      allow: "允许以下来源的应用程序：App Store 和已知开发者",
      blocked: "已阻止“Vermut”以保护 Mac。",
      button: "仍要打开",
    },
  },
  notFound: {
    metaTitle: "找不到页面",
    title: "这里没什么可倒的。",
    body: "你要找的页面不存在。Vermut 在首页等你。",
    back: "返回 Vermut",
  },
});
