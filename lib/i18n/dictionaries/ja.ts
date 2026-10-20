/**
 * 日本語. Machine-assisted, needs native review (see docs/I18N.md).
 * macOS labels from Apple's Japanese support page mh40616.
 */
import { links, site } from "@/site.config";
import { build } from "../build";

const macos = "macOS 14 Sonoma 以降";

export const ja = build({
  locale: "ja",
  seo: {
    title: "Vermut: Steam・GOG・Epic で Windows ゲームを Mac で",
    description:
      "Appleシリコン搭載Mac向けの無料・オープンソースのランチャー。Vermut は Steam と GOG Galaxy をインストールし、Epic Games（ベータ）を追加、Wine を設定して Windows ゲームを起動します。",
    keywords: ["Mac Windows ゲーム", "Steam Mac Appleシリコン", "Epic Games Mac", "GOG Galaxy Mac", "Wine macOS", "Whisky 代替", "CrossOver 代替", "無料 オープンソース ゲームランチャー Mac", "Vermut"],
  },
  nav: ["使い方", "互換性", "比較", "支援", "FAQ", "ダウンロード"],
  hero: {
    eyebrow: "無料 · オープンソース · Apple Silicon",
    lead: "Vermut は Mac に Steam と GOG Galaxy をインストールし、Epic Games のライブラリ（ベータ）を追加して、それぞれに Wine を設定します。Windows ゲームがクリックひとつで起動します。",
    primary: "Mac 版をダウンロード",
    secondary: "GitHub でスターを付ける",
    meta: [macos, "Apple Silicon", `${site.license} ライセンス`],
    screenshotAlt:
      "Vermut の Library 画面。Steam のゲームが Ready と表示され、Play ボタンがあります。サイドバーには Stores、Library、Downloads と、Steam・Epic Games・GOG Galaxy それぞれのボトルが並んでいます。",
  },
  howItWorks: {
    eyebrow: "使い方",
    title: "3ステップ。ターミナル不要。",
    lead: "ボトルの設定も、Wine のバージョン選びも、コマンドラインも不要です。下の動画はすべて実際のアプリです。",
    steps: [
      {
        title: "ストアを選ぶ",
        body: "Steam、GOG Galaxy、Epic Games（ベータ）から選びます。Steam と GOG は公式インストーラで、Epic はオープンソースのクライアント Legendary 経由で導入され、Epic のランチャーは使いません。ストアごとに専用のボトルがあるので、互いに干渉しません。",
        description: "画面収録：Stores 画面に Steam、Epic Games（ベータ）、GOG Galaxy が表示され、それぞれ専用のボトルにインストールされています。ポインタがストアの上を移動し、Open Steam をクリックします。",
      },
      {
        title: "Vermut が Wine を設定",
        body: "各ボトルには Wine 11 と、ストアに合ったグラフィックスレイヤーが入ります。Steam は DXMT、Epic は DXVK、GOG は WineD3D です。あとから変更もできますが、その必要はありません。",
        description: "画面収録：ポインタがサイドバーから Steam のボトルを開き、Graphics タブに切り替えて、選択中のバックエンド DXMT を指します。",
      },
      {
        title: "プレイ",
        body: "いつもどおりストアにサインインしてゲームをインストールします。ゲームは Library に並び、Play を押すと正しいボトルで起動します。",
        description: "画面収録：ポインタが Library を開き、Ready と表示された Steam のゲームを確認して、Continue バーの Play をクリックします。",
      },
    ],
  },
  compatibility: {
    eyebrow: "互換性を正直に",
    title: "動くもの、動かないもの。",
    lead: "Vermut は Wine で Windows ゲームを動かします。快適に動くものも多い一方、決して動かないものもあります。60 GB をダウンロードする前にお伝えします。",
    groups: [
      {
        title: "たいてい動く",
        items: [
          ["DirectX 9・10・11 のゲーム（DXMT または DXVK で Metal に変換）。"],
          ["インディーや古めのタイトル。多くの場合いちばん簡単です。"],
          ["Steam と GOG Galaxy のクライアント本体、そして Legendary（ベータ）経由の Epic Games ライブラリ。"],
        ],
      },
      {
        title: "少し設定が必要",
        items: [
          ["DirectX 12 のゲームには Apple の ", { text: "Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" }, "（D3DMetal）が必要です。インストールすれば Vermut が検出しますが、同梱はしません。"],
          ["EA app や Ubisoft Connect など独自のランチャーを持つゲームは、ボトル内での Run .exe と試行錯誤が必要な場合があります。"],
        ],
      },
      {
        title: "動かない",
        items: [
          ["Valorant、Fortnite、Call of Duty など、カーネルレベルのアンチチートを使うゲーム。アンチチートが Wine をブロックし、Mac 側では対処できません。"],
          ["一部の周辺機器ツールや DRM など、Windows のドライバを必要とするもの。"],
        ],
      },
    ],
    footnote: [
      "ゲームを購入する前に、アンチチートの状況は ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " で、Mac での Wine の動作報告は ",
      { text: "CodeWeavers の互換性データベース", href: "https://www.codeweavers.com/compatibility" },
      " で確認してください。",
    ],
  },
  comparison: {
    eyebrow: "比較",
    title: "Vermut の立ち位置。",
    lead: "Mac で Windows ゲームを遊ぶ良い方法はいくつかあります。2026年10月時点での違いはこちらです。",
    rows: [
      { label: "価格", cells: [["無料"], ["無料"], ["74ドルから", "12か月のアップデート、14日間の無料体験 [3][4]"], ["無料"]] },
      { label: "オープンソース", cells: [["はい（MIT）"], ["はい（GPL-3.0）[2]"], ["いいえ", "Wine（LGPL）がベース"], ["はい（GPL-3.0）[6]"]] },
      { label: "開発継続", cells: [["はい"], ["いいえ", "2025年4月9日にアーカイブ。コミュニティのフォークが継続 [1][2]"], ["はい", "CrossOver 26、2026年2月 [5]"], ["はい", "v2.22.4、2026年10月15日 [7]"]] },
      {
        label: "Steam・Epic・GOG を自動で設定",
        cells: [
          ["はい", "Steam と GOG は専用ボトル、Epic（ベータ）は Legendary 経由で Epic ランチャー不要"],
          ["いいえ", "ボトルを作り、各インストーラを自分で実行"],
          ["はい", "独自のインストールカタログから。CrossOver 25 以降は Epic と GOG も [9][10]"],
          ["Epic、GOG、Amazon", "独自ランチャー。Steam クライアントなし [6]"],
        ],
      },
      {
        label: "Wine エンジン",
        cells: [
          ["同梱", "Wine 11、DXMT と DXVK。インストールすれば D3DMetal も"],
          ["同梱（更新停止）", "Wine 8 以降への更新なし [1]"],
          ["同梱", "CodeWeavers 独自ビルド"],
          ["選択可能", "Wine や GPTK ビルドをダウンロード、または CrossOver を利用 [8]"],
        ],
      },
      { label: "ターミナル不要", cells: [["はい"], ["はい"], ["はい"], ["はい"]] },
      { label: "サポート", cells: [["GitHub の Issue"], ["なし"], ["メールと電話", "ライセンス有効期間中 [3]"], ["コミュニティ", "GitHub と Discord"]] },
    ],
    aside: ["商用サポートや最大限の互換性が必要なら CrossOver を購入してください。CodeWeavers は Wine の最大級のコントリビュータで、Vermut を含む Mac 向け Wine プロジェクトはすべてその成果の上に成り立っています。"],
    sourcesTitle: "出典（2026年10月19日確認）",
  },
  support: {
    eyebrow: "Vermut を支援",
    title: "無料。これからもずっと。",
    lead: "Vermut は空き時間に作られています。寄付はその時間と、テストに使う Mac やゲームの費用になります。どちらにしても有料版は出ません。",
    donateLabel: "PayPal で寄付する",
    donateNote: "PayPal が新しいタブで開きます。",
    otherTitle: "お金以外でも、同じくらい助かります。",
    options: [
      { title: "GitHub でスター", body: "スターがあると、ほかの Mac ゲーマーがプロジェクトを見つけやすくなります。", label: "リポジトリにスターを付ける" },
      { title: "バグを報告", body: "不具合がありましたか？ macOS のバージョンとログを添えた Issue が修正につながります。", label: "バグ報告を作成" },
      { title: "動いたゲームを教えて", body: "遊んでみましたか？ 動いても動かなくても、ゲーム名、ストア、グラフィックスバックエンドを投稿してください。", label: "ゲームレポートを送る" },
    ],
    share: { title: "Vermut をシェア", body: "Mac でゲームをする知り合いがいたら、リンクを送ってください。", text: "Vermut：Steam・GOG・Epic で Windows ゲームを Mac で。無料・オープンソース。" },
  },
  faq: {
    eyebrow: "FAQ",
    title: "よくある質問。",
    items: [
      { q: "Vermut は本当に無料ですか？", a: [`はい。${site.license} ライセンスのオープンソースで、アカウント不要、有料版なし、テレメトリなしです。`] },
      { q: "Intel 搭載の Mac で動きますか？", a: ["いいえ。Vermut は Appleシリコン（M1 以降のすべてのチップ）向けです。"] },
      { q: "必要な macOS のバージョンは？", a: [`${macos}。`] },
      { q: "自分のゲームは動きますか？", a: ["ゲームによります。DirectX 9〜11 のタイトルの多くは動きますが、カーネルレベルのアンチチートを使うものは動きません。詳しくは", { text: "互換性", href: "#compatibility" }, "のセクションをご覧ください。"] },
      { q: "Vermut は Steam や Epic のパスワードを見られますか？", a: ["いいえ。Steam と GOG は、専用ボトルで動く公式ストアアプリ内でサインインします。Epic（ベータ）は Epic のサインインページでサインインし、セッションは Legendary が Mac に保存します。"] },
      { q: "Epic Games Launcher はインストールされますか？", a: ["いいえ。Epic 対応はベータで、オープンソースの Epic クライアント ", { text: "Legendary", href: "https://github.com/derrod/legendary" }, " を使います。サインイン、ライブラリの表示、ゲームのインストールと起動を Epic Games Launcher なしで行えます。"] },
      { q: "Apple の Game Porting Toolkit は同梱されていますか？", a: ["いいえ、同梱はしません。自分でインストールすれば、Vermut が検出してグラフィックスの選択肢に D3DMetal を追加します。"] },
      {
        q: "macOS に警告が表示されるのはなぜですか？",
        a: [
          "Vermut は無料のオープンソースで、有料の Apple Developer ID による署名も Apple の公証も受けていないため、Gatekeeper が保証できません。「システム設定」›「プライバシーとセキュリティ」で一度だけ許可してください（",
          { text: "初回起動の手順", href: "#download" },
          "を参照）。",
          { text: "ソースコード", href: links.github },
          "を読んだり、DMG の SHA-256 をこのページの値と照合したりできます。",
        ],
      },
      { q: "ターミナルや Homebrew は必要ですか？", a: ["いいえ。ストアのインストールからゲームの起動まで、すべてアプリ内で完結します。"] },
      { q: "Whisky とは何が違うのですか？", a: ["Whisky は汎用の Wine フロントエンドで、現在はメンテナンスされていません。Vermut はゲームストアを軸に作られています。ストアごとに設定済みのボトルがあり、インストールしたものはすべて Library にまとまります。"] },
      { q: "アンインストールするには？", a: ["Vermut で各ボトルの Danger zone から削除し（ストアとそのゲームが消えます）、Vermut をゴミ箱にドラッグします。"] },
    ],
    requirements: {
      title: "動作環境",
      items: [
        { label: "Mac", value: "Appleシリコン（M1 以降）" },
        { label: "macOS", value: "14 Sonoma 以降" },
        { label: "ストレージ", value: "10 GB の空き容量＋ゲーム用の容量" },
        { label: "Rosetta 2", value: "未インストールなら自動でインストール" },
        { label: "インターネット", value: "ストアとゲームのダウンロードに必要" },
      ],
    },
  },
  download: {
    eyebrow: "ダウンロード",
    title: "Mac 用 Vermut をダウンロード。",
    lead: "GitHub の最新リリースから DMG をひとつだけ。無料で、アカウントも不要です。",
    primaryLabel: (version) => `Vermut ${version} をダウンロード（.dmg）`,
    shaLabel: "SHA-256",
    allReleases: "すべてのリリースとリリースノート",
    brewLabel: "または Homebrew でインストール",
    installTitle: "1分でインストール",
    steps: (dmgName) => [
      `「ダウンロード」フォルダの ${dmgName} を開きます。`,
      "Vermut を「アプリケーション」フォルダにドラッグします。",
      "「アプリケーション」から Vermut を開きます。Rosetta 2 がない場合は Vermut がインストールします。",
    ],
    gatekeeper: {
      firstLaunch: "初回起動時は「システム設定」>「プライバシーとセキュリティ」を開き、「このまま開く」をクリックして Touch ID またはパスワードで確認します。",
      firstLaunchLink: "手順を見る",
      title: "初回起動：Vermut を一度だけ許可",
      why: "Vermut は有料の Apple Developer ID で署名されていない無料のオープンソースアプリのため、macOS が警告を表示します。",
      whySource: "ソースコード",
      whyAnd: "はすべて読むことができ、ダウンロードは",
      whySha: "SHA-256",
      whyEnd: "で検証できます。",
      steps: [
        { title: "Vermut を開いて「完了」をクリック", body: "「アプリケーション」で Vermut をダブルクリックします。“Vermut”は開かれませんでした、という警告が出たら「完了」をクリックします（「ゴミ箱に入れる」ではありません）。" },
        { title: "「プライバシーとセキュリティ」で「このまま開く」をクリック", body: "アップルメニュー ＞「システム設定」＞「プライバシーとセキュリティ」と選択し、「セキュリティ」までスクロールして、Vermut に関するメッセージの横にある「このまま開く」をクリックします。このボタンは手順 1 のあと約 1 時間表示されます。" },
        { title: "もう一度「このまま開く」をクリック", body: "確認ダイアログが表示されたら「このまま開く」をクリックします。" },
        { title: "Touch ID またはパスワードで確認", body: "macOS が Touch ID または Mac のパスワードを求めることがあります。これは正常なので、そのまま確認してください。macOS がこの選択を記憶するので、操作は一度だけです。" },
      ],
      note: "これは macOS 15 Sequoia 以降の手順です。Sequoia 以降は Control キーを押しながらクリック ›「開く」では確認を省略できません。macOS 14 Sonoma ではこの方法がまだ使えます。",
      appleLabel: "Apple サポート：開発元が不明なMacアプリを開く",
      appleHref: "https://support.apple.com/ja-jp/guide/mac-help/mh40616/mac",
      illustrationNote: "簡略化したイラストで、スクリーンショットではありません。",
    },
    terminal: {
      title: "ターミナル派なら：コマンドひとつでインストール（Gatekeeper の警告なし）",
      body: "スクリプトが最新の DMG をダウンロードし、Vermut を「アプリケーション」にコピーします。実行前に内容を確認してください。",
      sourceLabel: "install.sh のソースを見る",
    },
  },
  footer: {
    statement: "無料でオープンソース。アカウントなし、テレメトリなし、有料版なし。",
    cta: "Mac 版をダウンロード",
    columns: [
      { title: "プロジェクト", links: ["GitHub", "リリース", `${site.license} ライセンス`, "ブランド素材（.zip）"] },
      { title: "参加する", links: ["Vermut を支援", "コントリビューションガイド", "バグを報告", "未解決の Issue"] },
    ],
    legal: "Vermut は Valve、Epic Games、GOG、CodeWeavers、Apple のいずれとも提携していません。Steam、Epic Games Store、GOG Galaxy などの名称は各所有者の商標です。",
  },
  ui: {
    skipToContent: "本文へスキップ",
    primaryNav: "メイン",
    backToTop: "Vermut、ページの先頭へ",
    releaseDetails: "リリースの詳細",
    stepPrefix: (n) => `ステップ ${n}：`,
    videoLabel: (title) => `${title}：Vermut の画面収録`,
    play: (label) => `再生：${label}`,
    pause: (label) => `一時停止：${label}`,
    compareCaption: "Vermut と Whisky、CrossOver、Heroic の比較。角括弧の番号は表の下の出典を示します。",
    feature: "項目",
    copied: "コピーしました",
    copySha: (file) => `${file} の SHA-256 をコピー`,
    copyInstall: "インストールコマンドをコピー",
    copyLink: "Vermut へのリンクをコピー",
    opensNewTab: "（新しいタブで開きます）",
    shareNewTab: "（共有、新しいタブで開きます）",
    language: "言語",
    macosRequirement: macos,
    appleSilicon: "Appleシリコン（M1 以降）",
    facts: { version: "バージョン", size: "サイズ", macos: "macOS", mac: "Mac", licence: "ライセンス" },
    version: (v) => `バージョン ${v}`,
    latest: "最新",
    releaseNotes: (v) => `Vermut ${v} のリリースノート`,
    licence: (l) => `${l} ライセンス`,
  },
  illustrations: {
    note: "簡略化したイラストで、スクリーンショットではありません。",
    dialog: {
      aria: "macOS の警告ダイアログ「“Vermut”は開かれませんでした」のイラスト。「完了」と「ゴミ箱に入れる」のボタンがあります。「完了」をクリックします。",
      title: "“Vermut”は開かれませんでした",
      body: "Macに損害を与えたり、プライバシーを侵害したりする可能性のあるマルウェアが“Vermut”に含まれていないことをAppleは検証できませんでした。",
      trash: "ゴミ箱に入れる",
      done: "完了",
    },
    settings: {
      aria: "「システム設定」の「プライバシーとセキュリティ」、「セキュリティ」セクションのイラスト。Vermut がブロックされたというメッセージと「このまま開く」ボタンがあります。",
      window: "プライバシーとセキュリティ",
      section: "セキュリティ",
      allow: "アプリケーションの実行許可：App Store と既知のデベロッパ",
      blocked: "Macを保護するため“Vermut”がブロックされました。",
      button: "このまま開く",
    },
  },
  notFound: {
    metaTitle: "ページが見つかりません",
    title: "ここには注ぐものがありません。",
    body: "お探しのページは存在しません。Vermut はトップページにあります。",
    back: "Vermut に戻る",
  },
});
