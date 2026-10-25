import type { Guide } from "@/lib/guides";
import { S } from "@/lib/guides";

export const guides: readonly Guide[] = [
  {
    slug: "install-wine-on-mac-apple-silicon",
    label: "在 Mac 上安装 Wine（2026）",
    metaTitle: "如何在 Mac 上安装 Wine（Apple 芯片，Sonoma 到 Tahoe）",
    description:
      "Homebrew 的 wine-stable cask 自 2026 年 9 月 1 日起已停用。现在如何在 M1 到 M4 Mac 上使用 Wine：Gcenx 构建、Vermut 这样的前端，或 CrossOver。",
    h1: "在 Mac 上安装 Wine：2026 年可行的方法",
    answer: [
      "过去的方法 brew install --cask wine-stable 已经不能用了：由于无法通过 Apple 的 Gatekeeper 检查，Homebrew 已在 2026 年 9 月 1 日停用该 cask。GitHub 上的 Gcenx 项目仍提供 macOS 版 Wine，但前缀、图形层和游戏商店都要你自己配置。如果你是为了玩 Windows 游戏才需要 Wine，Vermut 这样的前端会替你下载 Wine 11，并把 Steam 或 Epic Games（测试版）装进专用的容器（bottle），完全免费。",
    ],
    sections: [
      {
        id: "what-changed",
        title: "macOS 上的 Wine 有什么变化",
        body: [
          ["多年来，几乎所有教程都让你用 Homebrew 安装 Wine。wine-stable cask（Wine 11.0）现已因 fails_gatekeeper_check 被停用，Homebrew 不再安装它。2026 年 9 月之前的教程在这一点上已经过时。"],
          ["Wine 本身仍在开发，也仍能在 macOS 上运行。在 Apple 芯片 Mac 上，它通过 Rosetta 2 运行 x86-64 Windows 程序，因此需要安装 Rosetta 2。游戏还需要把 DirectX 转换为 Metal 的图形层，例如 DXMT、DXVK 配合 MoltenVK，或 Apple 的 D3DMetal；单独的 Wine 只带有基于 OpenGL 的 WineD3D。"],
        ],
      },
      {
        id: "options",
        title: "在 Apple 芯片 Mac 上获得 Wine 的三种方式",
        bullets: [
          ["Gcenx 构建，免费。Gcenx 项目在 GitHub 上发布 macOS 版 Wine Stable、Staging 和 Devel。适合熟悉终端、并且不只想用 Wine 玩游戏的人。"],
          ["免费前端，例如 Vermut。它会下载自己的 Wine 11 构建，并按需下载 Gcenx Wine Staging 和 Devel，为每个商店创建一个容器。专为 Steam 和 Epic 游戏设计，无需终端。"],
          ["CrossOver，付费。CodeWeavers 的商业版 Wine，提供 14 天试用和技术支持。如果必须运行某个特定的 Windows 游戏或软件，它的兼容性最广。"],
        ],
      },
      {
        id: "steps",
        title: "用 Vermut 五分钟搞定游戏用 Wine",
        steps: [
          { title: "检查你的 Mac", body: ["需要 Apple 芯片（M1 或更新）和 macOS 14 Sonoma 或更高版本。不支持 Intel Mac。"] },
          { title: "安装 Vermut", body: ["下载 DMG，把 Vermut 拖到“应用程序”，然后按照", { text: "首次打开指南", href: "/zh/open-anyway-unnotarized-app-mac" }, "允许一次。"] },
          { title: "让它安装 Rosetta 2 和 Wine", body: ["首次打开时，如果缺少 Rosetta 2，Vermut 会提示安装，并下载它的 Wine 11 引擎。"] },
          { title: "选择商店", body: ["选择 Steam 或 Epic Games（测试版）。Vermut 会为每个商店创建一个配好图形层的容器。GOG Galaxy 即将推出。"] },
          { title: "需要其他 Wine 版本？", body: ["在 设置 › Wine Engines 中下载 Wine Staging 或 Wine Devel，并只为某个容器或某个游戏选用。"] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "坦诚说明限制",
        bullets: [
          ["Wine 不是 Windows。很多程序能运行，有些不能，使用内核级反作弊的游戏永远无法运行。"],
          ["Vermut 是为游戏商店打造的。办公软件或单个 Windows 工具可能更适合单独的 Wine 或 CrossOver，不过 Vermut 也能在自定义容器中运行 .exe。"],
          ["Rosetta 2 是关键：Apple 已宣布将在未来的 macOS 版本中限制 Rosetta，因此 Mac 上的 Wine 可能还会变化。"],
        ],
      },
    ],
    faq: [
      { q: "为什么 brew install wine-stable 会失败？", a: ["由于软件包无法通过 macOS 的 Gatekeeper 检查，Homebrew 已在 2026 年 9 月 1 日停用 wine-stable cask。请使用 GitHub 上的 Gcenx 构建、Vermut 这样的前端，或 CrossOver。"] },
      { q: "Wine 能在 macOS Sequoia 和 Tahoe 上运行吗？", a: ["能，在 Apple 芯片上通过 Rosetta 2 运行。Vermut 需要 macOS 14 Sonoma 或更高版本，在更新的版本上同样可用。"] },
      { q: "Wine 免费吗？", a: ["免费。Wine 是自由开源软件。为游戏安装和管理 Wine 的 Vermut 也免费，采用 MIT 许可证。"] },
      { q: "可以在 Intel Mac 上用 Wine 吗？", a: ["有适用于 Intel Mac 的 Wine 构建，但 Vermut 只支持 Apple 芯片。"] },
    ],
    sources: [S.brewWine, S.gcenxWine, S.winehq, S.cxStore, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "epic-games-windows-games-on-mac",
    label: "在 Mac 上玩 Epic 的 Windows 游戏",
    metaTitle: "在 M1、M2、M3 或 M4 Mac 上玩 Epic Games Store 的 Windows 游戏",
    description:
      "Mac 版 Epic Games 启动器只能安装 Mac 游戏。本文介绍如何用 Vermut 和 Legendary 在 Apple 芯片 Mac 上免费安装并游玩你的 Epic Windows 游戏库。",
    h1: "在 Mac 上玩 Epic Games Store 的 Windows 游戏",
    answer: [
      "Mac 版 Epic Games 启动器只能安装有 Mac 版本的游戏。要玩 Windows 版游戏，需要在 Apple 芯片 Mac 上使用 Wine。Vermut 以测试版形式免费提供这项功能：它使用开源 Epic 客户端 Legendary。你在 Epic 官方页面登录，查看游戏库，然后在 Wine 11 容器中安装并启动 Windows 游戏，无需 Epic 启动器。Fortnite 等使用内核级反作弊的游戏无法运行。",
    ],
    sections: [
      {
        id: "why",
        title: "为什么只靠 Mac 版 Epic 启动器不够",
        body: [
          ["Epic 启动器可以在 macOS 上运行，但游戏库里只提供 Mac 版本。你在 Epic Games Store 购买或免费领取的大多数游戏只有 Windows 版，因此无法安装。"],
          ["在 Wine 中运行 Windows 版 Epic 启动器是可行的，但很笨重。Vermut 直接跳过它：Legendary 直接与 Epic 服务器通信，下载游戏的 Windows 文件并在 Wine 中启动。"],
        ],
      },
      {
        id: "steps",
        title: "用 Vermut 设置你的 Epic 游戏库",
        steps: [
          { title: "安装 Vermut", body: ["需要运行 macOS 14 或更高版本的 Apple 芯片 Mac。把 Vermut 拖到“应用程序”，然后按照", { text: "首次打开指南", href: "/zh/open-anyway-unnotarized-app-mac" }, "允许一次。"] },
          { title: "选择 Epic Games（测试版）", body: ["在商店中选择 Epic Games。Vermut 会下载 Wine 引擎和 Legendary 客户端，并校验其校验和。"] },
          { title: "在 Epic 页面登录", body: ["Vermut 会打开 Epic 的登录页面。你的密码发送给 Epic，而不是 Vermut；Legendary 会把会话保存在你的 Mac 上。"] },
          { title: "安装游戏", body: ["你的 Epic 游戏库会显示在 Vermut 中。安装游戏后，它会下载到 Epic 容器里。"] },
          { title: "开始游戏，必要时调整", body: ["已安装的游戏会带着 Play 按钮出现在游戏库中。如果某个游戏有问题，按 ⌥⌘I 打开游戏设置，试试其他图形后端。"] },
        ],
      },
    ],
    after: [
      {
        id: "what-works",
        title: "可以期待什么",
        bullets: [
          ["通常能运行：DirectX 9 到 11 的游戏，尤其是较老的作品和独立游戏。"],
          ["DirectX 12 游戏需要 Apple 的 D3DMetal：参见", { text: "在 Mac 上玩 DirectX 12 游戏", href: "/zh/directx-12-games-on-mac-d3dmetal" }, "。"],
          ["无法运行：Fortnite、Valorant 等使用内核级反作弊的游戏。请先在 ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, " 上查询。"],
          ["Vermut 的 Epic 支持仍是测试版。官方启动器的部分功能（如商店、好友列表）没有：请在 Epic 网站上购买和领取游戏。"],
        ],
      },
    ],
    faq: [
      { q: "能用 Vermut 在 Mac 上玩 Fortnite 吗？", a: ["不能。Fortnite 使用会阻止 Wine 的内核级反作弊。在 Mac 上只能通过云游戏来玩。"] },
      { q: "Vermut 会安装 Epic Games 启动器吗？", a: ["不会。它使用开源 Epic 客户端 Legendary，所以不需要启动器。"] },
      { q: "Epic 的免费游戏能玩吗？", a: ["免费领取的游戏和其他游戏一样在你的游戏库中，可以安装。能否运行取决于具体游戏。"] },
      { q: "Vermut 能看到我的 Epic 密码吗？", a: ["不能。你在 Epic 官方页面登录，Legendary 把会话保存在你的 Mac 上。"] },
    ],
    sources: [S.legendary, S.epicMac, S.aacy, S.vermutRelease, S.vermut],
  },

  {
    slug: "directx-12-games-on-mac-d3dmetal",
    label: "用 D3DMetal 在 Mac 上玩 DirectX 12 游戏",
    metaTitle: "在 Mac 上玩 DirectX 12 游戏：如何使用 D3DMetal",
    description:
      "DirectX 12 的 Windows 游戏需要 Apple 游戏移植工具包中的 D3DMetal。本文分步介绍如何免费下载并在 Vermut 中使用。",
    h1: "在 Apple 芯片 Mac 上玩 DirectX 12 游戏",
    answer: [
      "DirectX 12 游戏需要 D3DMetal，这是 Apple 游戏移植工具包（Game Porting Toolkit）中的转换层。Apple 的许可不允许应用内置它，所以你需要用免费的 Apple 账户从 developer.apple.com 自行下载。之后 Vermut 会找到它，确认版本为 2.0 或更高，并把 D3DMetal 作为容器或单个游戏的图形后端供你选择。",
    ],
    sections: [
      {
        id: "why",
        title: "为什么 DirectX 12 需要额外组件",
        body: [
          ["Mac 使用的是 Metal，而不是 DirectX。Vermut 的默认图形层 DXMT 把 DirectX 10 和 11 转换为 Metal，DXVK 则通过 Vulkan 和 MoltenVK 支持 DirectX 9 到 11。两者都无法在 Mac 上处理 DirectX 12。"],
          ["Apple 的 D3DMetal 可以。它是 Apple 为测试 Windows 游戏的开发者打造的游戏移植工具包的一部分，商业工具运行 DirectX 12 用的也是这一层。"],
        ],
      },
      {
        id: "steps",
        title: "安装 D3DMetal 并在 Vermut 中使用",
        steps: [
          { title: "登录 Apple Developer", body: ["前往 developer.apple.com，用你的 Apple 账户登录。免费账户即可。"] },
          { title: "下载游戏移植工具包", body: ["在下载列表中找到 Game Porting Toolkit，下载 .dmg。"] },
          { title: "打开评估环境", body: ["打开 .dmg，再打开“Evaluation environment for Windows games”，并接受许可协议。这样会激活包含 D3DMetal 的卷。"] },
          { title: "让 Vermut 自动查找", body: ["打开 Vermut › 设置 › D3DMetal。Vermut 会在常见位置查找；如果找不到，点按 Point to location…，选择 redist/lib 文件夹。"] },
          { title: "把游戏切换到 D3DMetal", body: ["在游戏库中选中游戏，按 ⌥⌘I 打开游戏设置，把 Graphics backend 设为 D3DMetal。也可以在容器的 Graphics 标签页中为整个容器设置。"] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "坦诚说明限制",
        bullets: [
          ["在 Vermut 中，D3DMetal 可用于 Steam 和 Epic 容器。Vermut 从不修改或再分发它。"],
          ["并非所有 DirectX 12 游戏都能运行，要求高的游戏需要强劲的 GPU：在基础款 M 芯片上，请预期降低画质设置。"],
          ["无论使用哪种图形层，内核级反作弊游戏仍然无法运行。"],
          ["如果游戏启动后崩溃，可以和 DXMT 对比：有些游戏的 DirectX 11 模式运行得更好。"],
        ],
      },
    ],
    faq: [
      { q: "D3DMetal 免费吗？", a: ["免费。游戏移植工具包可用免费 Apple 账户从 Apple 免费下载。"] },
      { q: "为什么 Vermut 不内置 D3DMetal？", a: ["Apple 的许可不允许应用内置。你从 Apple 下载，Vermut 使用你的副本。"] },
      { q: "需要哪个版本？", a: ["Vermut 需要 D3DMetal 2.0 或更高版本。如果找到旧版本，它会提示你从 Apple 下载最新版。"] },
      { q: "需要 Xcode 或终端吗？", a: ["不需要。配合 Vermut，你只需下载 .dmg、打开它并接受许可协议。"] },
    ],
    sources: [S.gptk, S.gptkDownload, S.gptkReq, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "open-anyway-unnotarized-app-mac",
    label: "首次打开 Vermut（仍要打开）",
    metaTitle: "Apple 无法验证 App？用“仍要打开”打开 Vermut",
    description:
      "为什么 macOS 无法验证 Vermut，以及如何在 Sonoma、Sequoia 及更高版本中通过“隐私与安全”里的“仍要打开”安全地打开它。另附如何校验下载文件。",
    h1: "在 macOS 上首次打开 Vermut",
    answer: [
      "macOS 首次打开时拦截 Vermut，是因为它是一款尚未使用付费 Apple Developer ID 公证的免费 App，而不是因为它含有恶意软件。先打开一次并点按“完成”，再前往“系统设置” › “隐私与安全”，在关于 Vermut 的信息旁点按“仍要打开”，然后用触控 ID 或密码确认。之后即可正常打开。从 macOS Sequoia 起，按住 Control 键点按 › “打开”已无法跳过这一步。",
    ],
    sections: [
      {
        id: "why",
        title: "为什么 macOS 会发出警告",
        body: [
          ["Gatekeeper 会检查 App 是否使用 Apple Developer ID 签名并经过 Apple 公证。公证需要付费的开发者会员资格。Vermut 是采用 MIT 许可证的免费项目，尚未公证，因此 macOS 会显示类似“Apple 无法验证 Vermut 是否包含恶意软件”的警告。"],
          ["这个警告意味着 Apple 没有检查过这款 App，而不是发现了问题。你可以在 GitHub 上阅读全部源代码，并将下载文件与下载页面和发行说明中公布的 SHA-256 进行比对。"],
        ],
      },
      {
        id: "steps",
        title: "逐步打开 Vermut",
        steps: [
          { title: "从“应用程序”打开 Vermut", body: ["把 Vermut 从 DMG 拖到“应用程序”并打开。macOS 显示警告时，请点按“完成”，不要点按“移到废纸篓”。"] },
          { title: "在“隐私与安全”中点按“仍要打开”", body: ["选取苹果菜单 >“系统设置”>“隐私与安全”，向下滚动到“安全性”，在关于 Vermut 的信息旁边点按“仍要打开”。此按钮在第 1 步后约一小时内可用。"] },
          { title: "再次点按“仍要打开”", body: ["系统会显示确认对话框，请点按“仍要打开”。"] },
          { title: "用触控 ID 或密码确认", body: ["macOS 会把 Vermut 存为例外。下次只需连按即可打开。"] },
        ],
      },
    ],
    after: [
      {
        id: "check",
        title: "如果愿意，先校验下载文件",
        bullets: [
          ["在终端中对“下载”文件夹里的 DMG 运行 shasum -a 256，并将结果与 Vermut 下载页面上的 SHA-256 比对。"],
          ["只从 Vermut 的 GitHub 发布页或链接到那里的官方网站下载。"],
          ["不要为整台 Mac 关闭 Gatekeeper。“仍要打开”只为这一个 App 设置例外。"],
        ],
      },
    ],
    faq: [
      { q: "Vermut 安全吗？", a: ["Vermut 是开源的，任何人都能查看它做了什么，每个版本都会公布 SHA-256。没有账户，也没有遥测。macOS 的警告与公证有关，并不代表检测到威胁。"] },
      { q: "为什么按住 Control 键点按 › “打开”不起作用？", a: ["Apple 在 macOS Sequoia 中移除了这个捷径。请改用“隐私与安全”中的“仍要打开”。"] },
      { q: "我看不到“仍要打开”。", a: ["请先尝试打开 Vermut 并点按“完成”：此按钮只会在打开被拦截后约一小时内出现。然后查看“隐私与安全”底部的“安全性”部分。"] },
      { q: "每次更新都要重复吗？", a: ["通常每个下载的副本只需一次。如果新版本后 macOS 再次警告，请重复同样的步骤。"] },
    ],
    sources: [S.appleOpenAnyway, S.appleSafely, S.appleSequoia, S.vermutRelease, S.vermut],
  },

  {
    slug: "wine-bottles-and-game-settings-mac",
    label: "Vermut 的容器与单个游戏设置",
    metaTitle: "Vermut 中的 Wine 容器、图形后端和单个游戏设置",
    description:
      "Vermut 的 Wine 容器（bottle）如何工作：每个商店一个，可为任意 .exe 创建自定义容器，并可为每个游戏单独设置 Wine 引擎、DXMT、DXVK、WineD3D 或 D3DMetal。",
    h1: "Vermut 中的 Wine 容器与单个游戏设置",
    answer: [
      "容器（bottle）是一个独立的 Windows 环境，即拥有自己 C: 盘的 Wine 前缀。Vermut 为每个商店创建一个容器，你也可以为 Steam 和 Epic 之外的程序添加自定义容器。设置是分层的：Vermut 的设置提供默认值，每个容器可以修改，从 1.2 起每个游戏还能在游戏设置（⌥⌘I）中再次修改。“Automatic”始终显示继承的值。",
    ],
    sections: [
      {
        id: "layers",
        title: "设置、容器、游戏：分层如何运作",
        bullets: [
          ["设置（⌘,）保存默认值：Wine 引擎、图形后端、DXMT 版本和日志级别。"],
          ["容器会使用这些值，直到你在它的页面上修改。商店容器还提供 Windows 版本（10、8.1 或 7）、高分辨率模式、winecfg、在访达中打开容器的 C: 盘、日志和诊断。"],
          ["游戏会使用其容器的值，直到你在游戏设置中覆盖。修改只影响这个游戏。"],
          ["更换引擎不会影响游戏和存档。如果商店正开着，更改会在下次打开时生效。"],
        ],
      },
      {
        id: "backends",
        title: "该用哪个图形后端",
        bullets: [
          ["DXMT，默认：把 DirectX 10 和 11 直接转换为 Metal。Vermut 在 设置 › Components 中管理多个 DXMT 版本，让游戏可以停留在旧版本。"],
          ["DXVK 配合 MoltenVK：通过 Vulkan 支持 DirectX 9 到 11。需要 Wine Staging，Vermut 会自动选择。"],
          ["WineD3D：Wine 自带的图形层，基于 OpenGL。速度较慢，但对老游戏有时兼容性最好。"],
          ["D3DMetal：Apple 的 DirectX 12 图形层，安装游戏移植工具包后可用。参见", { text: "在 Mac 上玩 DirectX 12 游戏", href: "/zh/directx-12-games-on-mac-d3dmetal" }, "。"],
        ],
      },
      {
        id: "steps",
        title: "常见操作",
        steps: [
          { title: "修改单个游戏的设置", body: ["在游戏库中选中游戏，按 ⌥⌘I（View › Game Settings）。选择 Wine 引擎、图形后端、DXMT 版本或日志级别，或保留 Automatic。"] },
          { title: "创建自定义容器", body: ["按 ⇧⌘N（File › New Bottle…）。为它命名，并选择引擎、图形后端和 Windows 版本，或保留 Automatic。"] },
          { title: "运行 Windows 安装程序", body: ["在自定义容器中点按 Run .exe or Installer…（⌘O），选择 .exe 或 .msi。也可以使用工具栏中的 Run .exe。"] },
          { title: "容器出问题时从头开始", body: ["在容器页面使用 Reset bottle。这会清除该容器及其中安装的游戏；你的商店账户和云存档不保存在那里。"] },
        ],
      },
    ],
    faq: [
      { q: "能导入 Whisky 或 CrossOver 的容器吗？", a: ["不能。Vermut 会创建自己的容器。请在 Vermut 中安装商店并重新下载游戏。"] },
      { q: "我的游戏在哪里？", a: ["在各个容器的 C: 盘中。从容器页面打开它即可在访达中查看文件。游戏在内置 SSD 上运行效果最好。"] },
      { q: "日志级别有什么用？", a: ["它决定 Wine 写入日志的信息量。在 GitHub 上报告问题时调高，之后改回 Automatic。"] },
      { q: "GOG Galaxy 有容器吗？", a: ["还没有。在 Vermut 1.2 中，GOG Galaxy 标记为 Coming soon。"] },
    ],
    sources: [S.vermutRelease, S.vermut, S.dxmt, S.gptk, S.gcenxWine],
  },
];
