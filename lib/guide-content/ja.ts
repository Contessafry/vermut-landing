import type { Guide, GuideUi } from "@/lib/guides";
import { S } from "@/lib/guides";
import { guides as more } from "./ja-more";
import { links } from "@/site.config";

const FIRST_LAUNCH = "/ja#first-launch";

const kernelAntiCheat = [
  "Valorant、Fortnite、Call of Duty など、カーネルレベルのアンチチートを使うゲームは Wine では動きません。これは Mac 側のツールではどうにもなりません。購入前に ",
  { text: "Are We Anti-Cheat Yet?", href: S.aacy.href },
  " で確認してください。",
] as const;

export const ui: GuideUi = {
  guides: "ガイド",
  download: "ダウンロード",
  home: "Vermut ホーム",
  breadcrumbGuide: "ガイド",
  downloadLabel: (v) => `Vermut ${v} をダウンロード (.dmg)`,
  firstLaunch: "初回起動ガイド",
  updated: "2026年10月22日更新 · Apple Silicon · macOS 14 以降",
  compared: "正直な比較",
  questions: "よくある質問",
  sources: "出典（2026年10月22日確認）",
  tryTitle: "Vermut を試す",
  tryBody: "無料のオープンソース。Wine 11 で Steam と Epic Games（ベータ）が動きます。Apple Silicon、macOS 14 以降。",
  moreGuides: "ほかのガイド",
  allGuides: "すべてのガイド",
  readGuide: "ガイドを読む",
  hub: {
    metaTitle: "ガイド：M1/M2/M3 Mac で Windows ゲームを遊ぶ方法",
    eyebrow: "ガイド",
    h1: "Mac で Windows ゲーム。正直に解説します。",
    description: "Apple Silicon の Mac で Windows ゲームを遊ぶための実用的で正直なガイド。Wine で Steam と Epic を動かす方法、DirectX 12、初回起動、Whisky の代わり、CrossOver を使わない方法。",
    back: "Vermut に戻る",
  },
};

const guides1: readonly Guide[] = [
  {
    slug: "run-windows-steam-games-on-apple-silicon",
    label: "Apple Silicon Mac で Windows 版 Steam ゲーム",
    metaTitle: "M1・M2・M3・M4 Mac で Windows 版 Steam のゲームを遊ぶ方法",
    description:
      "Wine、DXMT、Rosetta 2 を使って、Apple Silicon の Mac で Windows 版 Steam を動かす手順。動くもの、動かないもの、無料と有料の選択肢をまとめました。",
    h1: "Apple Silicon の Mac で Windows 版 Steam のゲームを遊ぶ方法",
    answer: [
      "Windows の命令を macOS 向けに変換する Wine の中に、Windows 版 Steam をインストールします。x86 のコードは Rosetta 2 が実行し、DXMT などのレイヤーが DirectX を Metal に変換します。Vermut はこの設定を無料で代わりに行います。Wine をダウンロードし、Steam 専用のボトルを作り、公式の Steam クライアントを起動します。DirectX 9〜11 のゲームの多くは動きますが、カーネルレベルのアンチチートを使うゲームは動きません。",
    ],
    sections: [
      {
        id: "why",
        title: "Mac 版 Steam だけでは足りない理由",
        body: [
          ["Mac 版 Steam に表示されるのは、Mac 版があるゲームだけです。一般的な Steam ライブラリの多くは Windows 専用で、Apple Silicon の Mac では Boot Camp も使えません。Windows 版を別の方法で動かす必要があります。"],
          ["Apple Silicon の Mac では、3 つの仕組みが連携します。Rosetta 2 が x86-64 のコードを実行し、Wine が Windows の API を提供し、グラフィックスレイヤーが DirectX を Metal に変換します。PC 全体をエミュレートするわけではないので速く動くことがあり、同じ理由で動かないゲームもあります。"],
        ],
      },
      {
        id: "steps",
        title: "Vermut で Windows 版 Steam を設定する",
        steps: [
          { title: "Mac を確認する", body: ["Apple Silicon（M1 以降）の Mac、macOS 14 Sonoma 以降、そして Wine・Steam・ゲーム用に数 GB の空き容量が必要です。Intel Mac には対応していません。"] },
          { title: "Vermut をダウンロードして開く", body: ["GitHub から DMG をダウンロードし、Vermut を「アプリケーション」にドラッグします。まだ公証を受けていないため、macOS が一度だけ許可を求めます。", { text: "初回起動ガイド", href: FIRST_LAUNCH }, "に従ってください。"] },
          { title: "Wine の準備を Vermut に任せる", body: ["初回起動時、Rosetta 2 がなければ Vermut がインストールを提案し、約 1〜2 GB の Wine 11 エンジンをダウンロードします。"] },
          { title: "Steam をインストールする", body: ["Steam の横にある Install をクリックします。Vermut が公式の Steam インストーラーを専用のボトルにダウンロードし、Steam の初回アップデートまで済ませます。あとはいつもの Steam アカウントでサインインします。"] },
          { title: "インストールして遊ぶ", body: ["PC と同じように Steam クライアントからゲームをインストールします。インストールしたゲームは Vermut のライブラリに表示されます。"] },
          { title: "うまく動かないときはグラフィックスバックエンドを変える", body: ["DirectX 10 と 11 には DXMT が標準で使われます。ボトルを DXVK、WineD3D、または Apple の Game Porting Toolkit をインストールしていれば D3DMetal に切り替えられます。v1.2 ベータではゲームごとの設定も追加されています。"] },
        ],
      },
      {
        id: "what-works",
        title: "Apple Silicon で動くもの、動かないもの",
        bullets: [
          ["たいてい動く：DirectX 9・10・11 のゲーム、そしてインディーや古めのタイトル。いちばん手軽なことが多いです。"],
          ["追加の準備が必要：DirectX 12 のゲームには、Apple から入手する Game Porting Toolkit に含まれる D3DMetal が必要です。独自のランチャーを持つゲームは試行錯誤が必要な場合があります。"],
          ["動かない：", ...kernelAntiCheat],
          ["性能はゲームとチップ次第です。変換にはコストがかかるので、同程度の GPU を積んだ Windows PC よりフレームレートは下がり、初回のシェーダーコンパイル中はカクつくことがあります。"],
        ],
        body: [["購入前に ", { text: "CodeWeavers の互換性データベース", href: S.cxCompat.href }, " でゲームを検索しましょう。CrossOver も同じ Wine をベースにしているので、報告は良い目安になります。"]],
      },
    ],
    compare: {
      caption: "Apple Silicon の Mac で Windows 版 Steam のゲームを遊ぶ方法（2026年10月時点）",
      columns: ["選択肢", "価格", "Windows 版 Steam クライアント", "おもな制限"],
      rows: [
        { label: "Vermut", cells: ["無料、MIT ライセンス", "動く、自動で設定", "新しいプロジェクト。サポートは GitHub の Issue"] },
        { label: "CrossOver", cells: ["12 か月のアップデートで 74 ドル。14 日間の試用あり", "動く、インストールカタログから", "有料。サポートがもっとも充実"] },
        { label: "Whisky", cells: ["無料", "自分で設定", "2025年4月にアーカイブ、Wine 8 以降なし"] },
        { label: "Parallels Desktop", cells: ["有料", "動く、Windows 11 Arm 版の中で", "DirectX は 11.1 まで。VM ではほとんどのアンチチートが動かない"] },
        { label: "GeForce NOW", cells: ["無料プランと有料プラン", "不要、対応ゲームをストリーミング", "高速な回線が必要。カタログにあるゲームのみ"] },
      ],
    },
    faq: [
      { q: "M1 Mac で Windows 版 Steam のゲームは動きますか？", a: ["はい。macOS 14 Sonoma 以降の Apple Silicon Mac なら、Wine で Windows 版 Steam クライアントを動かせます。軽いゲームや古いゲームは無印チップでもよく動き、重いゲームにはより強力な GPU とメモリが必要です。"] },
      { q: "Windows のライセンスは必要ですか？", a: ["いいえ。Wine は Windows ではないので、Windows をインストールしたり購入したりする必要はありません。Windows のライセンスが必要なのは、Parallels などの仮想マシンを使う場合だけです。"] },
      { q: "Steam のセーブデータや実績は使えますか？", a: ["はい。公式の Steam クライアントに自分のアカウントでサインインするので、クラウドセーブ、実績、ライブラリは PC と同じように使えます。"] },
      { q: "DirectX 12 のゲームは動きますか？", a: ["Apple の D3DMetal を使えば動くものもあります。Apple のライセンスではアプリへの同梱が認められていないため、", { text: "Game Porting Toolkit", href: S.gptk.href }, " を自分で Apple からダウンロードすると、Vermut がそれを検出します。"] },
      { q: "Steam アカウントは安全ですか？", a: ["Vermut は公式の Steam クライアントを起動するだけで、パスワードを見ることはありません。アンチチートが Wine を拒否するゲームは、起動しないかオンラインに接続できません。"] },
    ],
    sources: [S.vermut, S.gptk, S.gptkReq, S.cxStore, S.cx26, S.whiskyNotice, S.parallels, S.gfn, S.aacy, S.cxCompat],
  },

  {
    slug: "free-whisky-alternative-mac",
    label: "Mac 用 Whisky の無料代替",
    metaTitle: "Whisky の無料代替アプリ（Mac）：Whisky は開発終了",
    description:
      "Whisky は2025年4月にアーカイブされました。Mac で Windows ゲームを遊ぶための無料・有料の代替手段と、Vermut への移行方法を紹介します。",
    h1: "Mac で使える Whisky の無料代替",
    answer: [
      "Whisky は2025年4月9日にアーカイブされ、Wine 8 以降には更新されません。無料で開発が続いているものを探しているなら、Vermut は Wine 11 上に Steam と Epic Games（ベータ）を自動で設定するオープンソースのアプリです。もっとも広い互換性と本格的なサポートが必要なら、Whisky の作者自身が勧める有料の CrossOver があります。",
    ],
    sections: [
      {
        id: "status",
        title: "Whisky に何があったのか",
        body: [
          ["Whisky は、Apple Silicon の Mac で Wine を使うための人気の無料 SwiftUI アプリでした。開発者は開発を終え、2025年4月9日に GitHub リポジトリをアーカイブしました。メンテナンス告知によると、Wine 8 以降には移行せず、Steam を含む個別のアプリやゲームの修正も行われません。"],
          ["既存の環境はしばらく動くかもしれませんが、今後は何も修正されず、新しいゲームほど新しい Wine を必要とします。コミュニティのフォーク ", { text: "frankea/Whisky", href: S.whiskyFork.href }, " が独自に開発を続けています。"],
        ],
      },
      {
        id: "how-different",
        title: "Vermut と Whisky の違い",
        bullets: [
          ["ゲームストア中心の設計。Whisky は空のボトルを用意するだけでしたが、Vermut はストアごとにボトルを作り、公式の Steam クライアントをインストールし、Epic Games は Legendary（ベータ）で扱います。インストール済みのゲームはライブラリにまとまります。"],
          ["新しいエンジン。Vermut は Wine 11 をダウンロードし、DirectX 10・11 を Metal で動かす DXMT を標準に、Wine Staging と Wine Devel を予備として使えます。"],
          ["グラフィックスバックエンドも同じように選べます：DXMT、DXVK と MoltenVK、WineD3D、そして Apple の Game Porting Toolkit をインストールしていれば D3DMetal。"],
          ["対応ストアにないゲームでも、Windows の .exe、.msi、.bat をボトル内で実行できます。"],
          ["無料で MIT ライセンス。アカウント不要、テレメトリなし。"],
        ],
      },
      {
        id: "move",
        title: "Whisky から Vermut に移行する",
        steps: [
          { title: "遊んでいるゲームをメモする", body: ["ゲームと、Whisky でうまく動いた設定を書き出しておきます。Steam と Epic はライブラリとクラウドセーブをサーバーに保存しています。"] },
          { title: "ローカルのセーブデータをバックアップする", body: ["Whisky のボトルの中にだけセーブを保存するゲームもあります。何かを変える前にコピーしてください。Vermut は Whisky のボトルを読み込めません。"] },
          { title: "Vermut をインストールする", body: ["GitHub からダウンロードし、", { text: "初回起動ガイド", href: FIRST_LAUNCH }, "に従って「プライバシーとセキュリティ」で一度だけ許可します。"] },
          { title: "ストアをインストールする", body: ["Stores ページから Steam をインストールするか、Epic Games にサインインします。Vermut が Wine をダウンロードし、ボトルを作ります。"] },
          { title: "ゲームを入れ直す", body: ["ストアのクライアントからゲームを再ダウンロードし、必要ならローカルのセーブを戻します。すべて動くまで Whisky は残しておき、その後で削除してください。"] },
        ],
      },
    ],
    compare: {
      caption: "Whisky とその代替（2026年10月時点）",
      columns: ["選択肢", "価格", "開発状況", "向いている人"],
      rows: [
        { label: "Vermut", cells: ["無料、MIT", "継続中", "設定なしで Steam と Epic のゲームを遊びたい人"] },
        { label: "Whisky", cells: ["無料、GPL-3.0", "終了、2025年4月にアーカイブ", "新しいことはなし。既存環境のみ"] },
        { label: "Whisky のコミュニティフォーク", cells: ["無料", "継続中、別の開発者", "ボトルをそのまま使いたい Whisky ユーザー"] },
        { label: "CrossOver", cells: ["12 か月のアップデートで 74 ドル、永久版 494 ドル", "継続中、2026年2月に CrossOver 26", "最大の互換性と商用サポート"] },
        { label: "Game Porting Toolkit", cells: ["Apple から無料でダウンロード", "継続中、開発者向け", "DirectX 12 ゲームの検証用。ランチャーではない"] },
      ],
    },
    after: [
      {
        id: "choose",
        title: "どれを選ぶべき？",
        bullets: [
          ["Whisky で Steam や Epic のゲームを遊んでいて、無料で開発が続いている代わりがほしい：まず Vermut を試してください。数分で終わり、費用もかかりません。"],
          ["作り直したくないカスタムボトルがたくさんある：コミュニティのフォークは Whisky のボトルを読み込めます。別の人が開発しているので、その更新内容で判断してください。"],
          ["特定のゲームを確実に動かしたい、困ったときに助けがほしい：CrossOver の 14 日間試用を始め、そのゲームが動いたら購入しましょう。"],
          ["DirectX 12 の移植を検証している開発者：Apple の Game Porting Toolkit がそのためのツールです。"],
        ],
      },
      {
        id: "limits",
        title: "正直に言うと、限界もあります",
        bullets: [
          [...kernelAntiCheat],
          ["Vermut は新しいプロジェクトで、小さなチームが開発しています。商用サポートはなく、不具合は GitHub の Issue で対応します。"],
          ["どの Wine フロントエンドも、土台の Wine より速くゲームを動かすことはできません。Whisky で Wine が原因で動かなかったゲームは、ほかで動くと決めつける前に試してください。"],
        ],
      },
    ],
    faq: [
      { q: "Whisky は開発終了したのですか？", a: ["オリジナルのプロジェクトは開発が止まっています。GitHub リポジトリは2025年4月9日にアーカイブされ、Wine 8 以降には対応しません。別の人によるコミュニティフォークはあります。"] },
      { q: "Whisky のボトルを Vermut に移せますか？", a: ["いいえ。Vermut はストアごとに独自のボトルを作ります。ローカルのセーブをバックアップし、Vermut でストアをインストールして、ゲームを再ダウンロードしてください。"] },
      { q: "Vermut は本当に無料ですか？", a: ["はい。MIT ライセンスのオープンソースで、アカウントも有料プランもテレメトリもありません。", { text: "ソースコード", href: links.github }, "も公開しています。"] },
      { q: "Whisky の作者はなぜ CrossOver を勧めるのですか？", a: ["CrossOver を開発する CodeWeavers は、Mac 向け Wine の開発の大部分を担っています。その売上が開発資金になっており、Vermut を含む無料の Mac 向け Wine プロジェクトはすべてその成果の上に成り立っています。"] },
      { q: "Vermut は Intel Mac で動きますか？", a: ["いいえ。Vermut には Apple Silicon の Mac と macOS 14 Sonoma 以降が必要です。"] },
    ],
    sources: [S.whiskyNotice, S.whiskyRepo, S.whiskyFork, S.cxStore, S.cx26, S.gptk, S.legendary, S.vermut, S.aacy],
  },

  {
    slug: "run-windows-games-on-mac-without-crossover",
    label: "CrossOver なしで Mac で Windows ゲーム",
    metaTitle: "CrossOver なしで Mac で Windows ゲームを無料で遊ぶ方法",
    description:
      "CrossOver を使わずに Apple Silicon の Mac で Windows ゲームを遊ぶ無料の方法：Vermut と Wine、Apple の Game Porting Toolkit、仮想マシン、クラウドゲーミング。",
    h1: "CrossOver を使わずに Mac で Windows ゲームを遊ぶ方法",
    answer: [
      "無料の Wine フロントエンドを使いましょう。Vermut はオープンソースで、Apple Silicon の Mac なら Wine 11、Steam、Epic Games（ベータ）を自動で設定します。Wine で動かないゲームには、Mac で実行するのではなくストリーミングで遊ぶクラウドゲーミングという無料の手段もあります。サポートがもっとも充実した有料の選択肢は、今も CrossOver です。",
    ],
    sections: [
      {
        id: "what-crossover-does",
        title: "CrossOver がしていること、代わりに必要なもの",
        body: [
          ["CrossOver は CodeWeavers による Wine の商用版です。12 か月のアップデートとサポートで 74 ドル、永久ライセンスは 494 ドルで、購入したバージョンはサポート終了後も使い続けられます。14 日間の無料試用もあります。"],
          ["CrossOver なしで必要なのは 3 つ。macOS 用の Wine、DirectX を Metal に変換するグラフィックスレイヤー、そしてゲームストアをインストールして起動する仕組みです。ターミナルで手作業でもできますが、維持するのは大変です。Vermut はこの 3 つを 1 つのアプリにまとめています。"],
        ],
      },
      {
        id: "options",
        title: "無料の選択肢",
        bullets: [
          ["Vermut：無料のオープンソース。Steam と Epic Games（ベータ）をそれぞれの Wine 11 ボトルにインストールし、DirectX 10・11 には標準で DXMT を使い、DXVK、WineD3D、D3DMetal にも切り替えられます。"],
          ["Apple の Game Porting Toolkit：Apple のデベロッパアカウントで無料で入手でき、開発者が自分のゲームを評価するためのものです。多くの DirectX 12 ゲームを動かせる D3DMetal を含みますが、ランチャーではなく、アプリへの同梱も認められていません。"],
          ["GeForce NOW などのクラウドゲーミング：無料プランあり。ゲームはリモートの PC で動くのでアンチチートは問題になりませんが、高速で安定した回線が必要で、ゲームがサービスのカタログにある必要があります。"],
          ["Parallels Desktop などの仮想マシンは無料ではなく、VM 上の Windows Arm 版は DirectX 11.1 までしか対応せず、ほとんどのアンチチートが動きません。"],
        ],
      },
      {
        id: "steps",
        title: "Vermut で Windows ゲームを無料で遊ぶ",
        steps: [
          { title: "まずゲームを確認する", body: [{ text: "CodeWeavers の互換性データベース", href: S.cxCompat.href }, " と ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, " で調べます。カーネルレベルのアンチチートが必要なら、クラウドゲーミングを使いましょう。"] },
          { title: "Vermut をインストールする", body: ["DMG をダウンロードし、Vermut を「アプリケーション」にドラッグして、", { text: "初回起動ガイド", href: FIRST_LAUNCH }, "に従って一度だけ許可します。Apple Silicon の Mac と macOS 14 以降が必要です。"] },
          { title: "ストアをインストールする", body: ["Steam をインストールするか、Epic Games にサインインします。Vermut が Wine と、必要なら Rosetta 2 をダウンロードします。"] },
          { title: "DirectX 12 のゲームには D3DMetal を追加", body: ["Apple から Game Porting Toolkit をダウンロードします。Vermut がそれを検出し、D3DMetal をグラフィックスバックエンドとして選べるようにします。"] },
          { title: "ストアにないゲームはインストーラーを実行", body: ["Run .exe で、任意の Windows インストーラーをボトル内で実行できます。ストアのゲームより結果にばらつきがあります。"] },
        ],
      },
    ],
    compare: {
      caption: "CrossOver を使わずに Windows ゲームを遊ぶ方法（2026年10月時点）",
      columns: ["選択肢", "費用", "DirectX 12", "アンチチートのあるゲーム", "手間"],
      rows: [
        { label: "Vermut", cells: ["無料", "Apple の D3DMetal があれば可", "カーネルレベル：不可", "少ない、アプリ 1 つ"] },
        { label: "Game Porting Toolkit 単体", cells: ["無料", "可、D3DMetal 経由", "カーネルレベル：不可", "多い、ターミナルと手動設定"] },
        { label: "GeForce NOW", cells: ["無料プランと有料プラン", "可、リモート PC で実行", "可、対応ゲームのみ", "少ない、高速な回線が必要"] },
        { label: "Parallels Desktop", cells: ["有料、Windows も必要", "不可、DirectX 11.1 まで", "VM ではほとんど不可", "普通"] },
        { label: "CrossOver（参考）", cells: ["1 年分のアップデートで 74 ドル", "可、D3DMetal 経由", "カーネルレベル：不可", "少ない、商用サポート"] },
      ],
    },
    after: [
      {
        id: "performance",
        title: "性能はどのくらい期待できるか",
        body: [
          ["Wine は PC をエミュレートしませんが、Rosetta 2 と DirectX から Metal への変換で負荷が増えます。ミドルクラスの Windows PC で快適なゲームでも、無印の M チップでは設定を下げる必要があるかもしれません。新しいゲームの最初の数分は、シェーダーのコンパイル中にカクつくことがよくありますが、たいてい落ち着きます。"],
          ["起動はするのに表示がおかしい、落ちるといった場合は、まずグラフィックスバックエンドを切り替えてください。メモリも重要です。Game Porting Toolkit の公開されている動作要件では 16 GB が推奨されており、大きなゲームはどのバックエンドでも恩恵を受けます。"],
        ],
      },
      {
        id: "honest",
        title: "それでも CrossOver を選ぶ価値があるとき",
        body: [
          ["どうしても遊びたい特定のゲームがある、動かなくなったときに問い合わせ先がほしい、CodeWeavers が個別に修正したタイトルを遊ぶ、という場合は、あきらめる前に CrossOver の試用を試す価値があります。購入すれば、無料の Mac 向けプロジェクトすべてが使う Wine の開発を支えることにもなります。"],
          ["Vermut は無料ですが、新しいプロジェクトで、すべてのゲームが動くとは約束しません。強みは、手持ちの Steam と Epic のライブラリを Mac で無料かつ手軽に試せることです。"],
        ],
      },
    ],
    faq: [
      { q: "CrossOver に無料版はありますか？", a: ["ありません。CrossOver には 14 日間の無料試用があり、その後は有料ライセンスが必要です。Wine 自体は無料で、Vermut はそれをベースにした無料アプリです。"] },
      { q: "Wine はエミュレーターですか？", a: ["いいえ。Wine は Windows の API を macOS 上に実装し直したものです。Apple Silicon では Rosetta 2 が x86 のコードを変換するので、PC 全体をエミュレートするわけではありません。"] },
      { q: "Apple の Game Porting Toolkit でゲームを遊べますか？", a: ["開発者向けのツールですが、その D3DMetal レイヤーで多くの DirectX 12 ゲームが動きます。Apple からダウンロードすれば、Vermut が D3DMetal をバックエンドとして提供します。"] },
      { q: "Boot Camp は使えますか？", a: ["Boot Camp は Intel Mac にしかありません。Apple Silicon の Mac では Windows を起動できません。"] },
      { q: "アンチチートのあるゲームはなぜ動かないのですか？", a: ["カーネルレベルのアンチチートは本物の Windows カーネルを前提にしていて、Wine やほとんどの仮想マシンを拒否します。Mac でこうしたゲームを遊ぶ方法はクラウドゲーミングだけです。"] },
    ],
    sources: [S.cxStore, S.cxLicence, S.cx26, S.gptk, S.gptkReq, S.parallels, S.gfn, S.aacy, S.cxCompat, S.vermut],
  },
];

export const guides: readonly Guide[] = [...guides1, ...more];
