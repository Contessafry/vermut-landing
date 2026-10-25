import type { Guide } from "@/lib/guides";
import { S } from "@/lib/guides";

export const guides: readonly Guide[] = [
  {
    slug: "install-wine-on-mac-apple-silicon",
    label: "Mac に Wine をインストール（2026 年版）",
    metaTitle: "Mac に Wine をインストールする方法（Apple シリコン、Sonoma〜Tahoe）",
    description:
      "Homebrew の wine-stable cask は 2026 年 9 月 1 日から無効になりました。M1〜M4 Mac で今 Wine を使う方法：Gcenx のビルド、Vermut のようなフロントエンド、または CrossOver。",
    h1: "Mac に Wine をインストールする：2026 年に使える方法",
    answer: [
      "定番だった brew install --cask wine-stable はもう使えません。Apple の Gatekeeper チェックに通らないため、Homebrew が 2026 年 9 月 1 日にこの cask を無効にしました。macOS 向けの Wine ビルドは GitHub の Gcenx プロジェクトから今も入手できますが、プレフィックス、グラフィックスレイヤー、ストアは自分で設定する必要があります。Windows ゲームを遊ぶために Wine が欲しいなら、Vermut のようなフロントエンドが Wine 11 をダウンロードし、Steam または Epic Games（ベータ）を専用のボトルに無料でセットアップします。",
    ],
    sections: [
      {
        id: "what-changed",
        title: "macOS の Wine で何が変わったか",
        body: [
          ["長年、ほとんどのガイドは Homebrew で Wine を入れるよう案内してきました。wine-stable cask（Wine 11.0）は現在 fails_gatekeeper_check という理由で無効になっており、Homebrew ではインストールできません。2026 年 9 月より前のガイドは、この点で古くなっています。"],
          ["Wine 自体は開発が続いており、macOS でも動きます。Apple シリコン Mac では x86-64 の Windows プログラムを Rosetta 2 経由で実行するので、Rosetta 2 が必要です。ゲームにはさらに DirectX を Metal に変換するレイヤー（DXMT、DXVK と MoltenVK、Apple の D3DMetal など）が必要です。Wine 単体には OpenGL を使う WineD3D しかありません。"],
        ],
      },
      {
        id: "options",
        title: "Apple シリコン Mac で Wine を使う 3 つの方法",
        bullets: [
          ["Gcenx のビルド（無料）。Gcenx プロジェクトが macOS 向けの Wine Stable、Staging、Devel を GitHub で公開しています。ターミナルに慣れていて、ゲーム以外のソフトにも Wine を使いたい人向けです。"],
          ["Vermut のような無料フロントエンド。独自の Wine 11 ビルドに加え、必要に応じて Gcenx Wine Staging と Devel をダウンロードし、ストアごとにボトルを作ります。Steam と Epic のゲーム向けで、ターミナルは不要です。"],
          ["CrossOver（有料）。CodeWeavers の商用版 Wine で、14 日間の試用とサポートがあります。特定の Windows ゲームやソフトを確実に動かしたいときに最も幅広い互換性があります。"],
        ],
      },
      {
        id: "steps",
        title: "Vermut でゲーム用 Wine を 5 分で用意する",
        steps: [
          { title: "Mac を確認する", body: ["Apple シリコン（M1 以降）と macOS 14 Sonoma 以降が必要です。Intel Mac には対応していません。"] },
          { title: "Vermut をインストールする", body: ["DMG をダウンロードし、Vermut を「アプリケーション」にドラッグして、", { text: "初回起動ガイド", href: "/ja/open-anyway-unnotarized-app-mac" }, "の手順で一度だけ許可します。"] },
          { title: "Rosetta 2 と Wine を入れてもらう", body: ["初回起動時、Rosetta 2 がなければ Vermut がインストールを提案し、Wine 11 エンジンをダウンロードします。"] },
          { title: "ストアを選ぶ", body: ["Steam または Epic Games（ベータ）を選びます。Vermut はそれぞれに適したグラフィックスレイヤーのボトルを作ります。GOG Galaxy は近日対応予定です。"] },
          { title: "別の Wine バージョンが必要なら", body: ["設定 › Wine Engines で Wine Staging または Wine Devel をダウンロードし、特定のボトルやゲームだけに使えます。"] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "正直な制限",
        bullets: [
          ["Wine は Windows ではありません。多くのプログラムは動きますが、動かないものもあり、カーネルレベルのアンチチートを使うゲームは決して動きません。"],
          ["Vermut はゲームストア向けに作られています。オフィスソフトや単体の Windows ツールには Wine 単体や CrossOver の方が合う場合があります。ただし Vermut でもカスタムボトルで .exe を実行できます。"],
          ["Rosetta 2 が鍵です。Apple は今後の macOS で Rosetta を制限すると発表しているため、Mac の Wine は今後も変わる可能性があります。"],
        ],
      },
    ],
    faq: [
      { q: "brew install wine-stable が失敗するのはなぜ？", a: ["パッケージが macOS の Gatekeeper チェックに通らないため、Homebrew が 2026 年 9 月 1 日に wine-stable cask を無効にしました。GitHub の Gcenx ビルド、Vermut のようなフロントエンド、または CrossOver を使ってください。"] },
      { q: "Wine は macOS Sequoia や Tahoe で動きますか？", a: ["はい。Apple シリコンでは Rosetta 2 経由で動きます。Vermut は macOS 14 Sonoma 以降が必要で、それより新しいバージョンでも動きます。"] },
      { q: "Wine は無料ですか？", a: ["はい。Wine は無料のオープンソースソフトウェアです。ゲーム用に Wine をインストール・管理する Vermut も無料で、MIT ライセンスです。"] },
      { q: "Intel Mac で Wine を使えますか？", a: ["Intel Mac 向けの Wine ビルドはありますが、Vermut は Apple シリコンのみに対応しています。"] },
    ],
    sources: [S.brewWine, S.gcenxWine, S.winehq, S.cxStore, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "epic-games-windows-games-on-mac",
    label: "Epic の Windows ゲームを Mac で",
    metaTitle: "Epic Games Store の Windows ゲームを M1・M2・M3・M4 Mac で遊ぶ",
    description:
      "Mac 版 Epic Games Launcher は Mac 用ゲームしかインストールできません。Vermut と Legendary で、Epic の Windows ライブラリを Apple シリコンに無料でインストールして遊ぶ方法。",
    h1: "Epic Games Store の Windows ゲームを Mac で遊ぶ",
    answer: [
      "Mac 版 Epic Games Launcher がインストールできるのは Mac 版があるゲームだけです。Windows 版のゲームには、Apple シリコン Mac 上の Wine が必要です。Vermut はこれを無料のベータ機能として提供します。オープンソースの Epic クライアント Legendary を使い、Epic 公式ページでサインインしてライブラリを表示し、Epic のランチャーなしで Windows ゲームを Wine 11 のボトルにインストールして起動します。Fortnite などカーネルレベルのアンチチートを使うゲームは動きません。",
    ],
    sections: [
      {
        id: "why",
        title: "Mac 版 Epic ランチャーだけでは足りない理由",
        body: [
          ["Epic のランチャーは macOS で動きますが、ライブラリに表示されるのは Mac 版だけです。Epic Games Store で購入したり無料で受け取ったりしたゲームの多くは Windows 専用なので、インストールできません。"],
          ["Windows 版の Epic ランチャーを Wine で動かすこともできますが、重くて手間がかかります。Vermut はランチャーを使いません。Legendary が Epic のサーバーと直接やりとりし、ゲームの Windows 用ファイルをダウンロードして Wine で起動します。"],
        ],
      },
      {
        id: "steps",
        title: "Vermut で Epic ライブラリをセットアップする",
        steps: [
          { title: "Vermut をインストールする", body: ["macOS 14 以降の Apple シリコン Mac が必要です。Vermut を「アプリケーション」にドラッグし、", { text: "初回起動ガイド", href: "/ja/open-anyway-unnotarized-app-mac" }, "の手順で一度だけ許可します。"] },
          { title: "Epic Games（ベータ）を選ぶ", body: ["ストアで Epic Games を選びます。Vermut が Wine エンジンと Legendary クライアントをダウンロードし、チェックサムを確認します。"] },
          { title: "Epic のページでサインインする", body: ["Vermut が Epic のサインインページを開きます。パスワードは Vermut ではなく Epic に送られ、セッションは Legendary が Mac 上に保存します。"] },
          { title: "ゲームをインストールする", body: ["Epic のライブラリが Vermut に表示されます。ゲームをインストールすると Epic のボトルにダウンロードされます。"] },
          { title: "遊んで、必要なら調整する", body: ["インストールしたゲームは Play ボタン付きでライブラリに表示されます。うまく動かない場合は ⌥⌘I でゲーム設定を開き、別のグラフィックスバックエンドを試してください。"] },
        ],
      },
    ],
    after: [
      {
        id: "what-works",
        title: "期待できること",
        bullets: [
          ["多くの場合動くもの：DirectX 9〜11 のゲーム、特に古めのタイトルやインディーゲーム。"],
          ["DirectX 12 のゲームには Apple の D3DMetal が必要です。", { text: "Mac で DirectX 12 ゲーム", href: "/ja/directx-12-games-on-mac-d3dmetal" }, "を参照してください。"],
          ["動かないもの：Fortnite、Valorant など、カーネルレベルのアンチチートを使うゲーム。事前に ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, " で確認してください。"],
          ["Vermut の Epic 対応はベータです。ストアやフレンドリストなど公式ランチャーの一部機能はありません。ゲームの購入や受け取りは Epic のウェブサイトで行ってください。"],
        ],
      },
    ],
    faq: [
      { q: "Vermut で Mac から Fortnite を遊べますか？", a: ["いいえ。Fortnite は Wine をブロックするカーネルレベルのアンチチートを使っています。Mac ではクラウドゲーミングでのみプレイできます。"] },
      { q: "Vermut は Epic Games Launcher をインストールしますか？", a: ["いいえ。オープンソースの Epic クライアント Legendary を使うので、ランチャーは不要です。"] },
      { q: "Epic の無料ゲームは動きますか？", a: ["無料で受け取ったゲームも他のゲームと同じくライブラリにあり、インストールできます。動くかどうかはゲームによります。"] },
      { q: "Vermut は Epic のパスワードを見られますか？", a: ["いいえ。サインインは Epic 公式ページで行い、セッションは Legendary が Mac 上に保存します。"] },
    ],
    sources: [S.legendary, S.epicMac, S.aacy, S.vermutRelease, S.vermut],
  },

  {
    slug: "directx-12-games-on-mac-d3dmetal",
    label: "D3DMetal で DirectX 12 ゲームを Mac で",
    metaTitle: "Mac で DirectX 12 ゲームを遊ぶ：D3DMetal の使い方",
    description:
      "DirectX 12 の Windows ゲームには、Game Porting Toolkit に含まれる Apple の D3DMetal が必要です。無料でダウンロードして Vermut で使う手順を解説します。",
    h1: "Apple シリコン Mac で DirectX 12 ゲームを遊ぶ",
    answer: [
      "DirectX 12 のゲームには、Game Porting Toolkit に含まれる Apple の変換レイヤー D3DMetal が必要です。Apple のライセンスではアプリへの同梱が認められていないため、無料の Apple アカウントで developer.apple.com から自分でダウンロードします。その後 Vermut が D3DMetal を見つけ、バージョン 2.0 以降かを確認し、ボトルまたは個別のゲームのグラフィックスバックエンドとして選べるようにします。",
    ],
    sections: [
      {
        id: "why",
        title: "DirectX 12 に追加のものが必要な理由",
        body: [
          ["Mac が使うのは DirectX ではなく Metal です。Vermut の標準レイヤー DXMT は DirectX 10 と 11 を Metal に変換し、DXVK は Vulkan と MoltenVK 経由で DirectX 9〜11 を扱います。どちらも Mac では DirectX 12 に対応していません。"],
          ["Apple の D3DMetal は対応しています。Windows ゲームを検証する開発者向けに Apple が作った Game Porting Toolkit の一部で、商用ツールが DirectX 12 に使っているのも同じレイヤーです。"],
        ],
      },
      {
        id: "steps",
        title: "D3DMetal をインストールして Vermut で使う",
        steps: [
          { title: "Apple Developer にサインインする", body: ["developer.apple.com にアクセスし、Apple アカウントでサインインします。無料アカウントで十分です。"] },
          { title: "Game Porting Toolkit をダウンロードする", body: ["ダウンロード一覧で Game Porting Toolkit を探し、.dmg をダウンロードします。"] },
          { title: "評価環境を開く", body: [".dmg を開き、次に「Evaluation environment for Windows games」を開いて、ライセンスに同意します。これで D3DMetal を含むボリュームが有効になります。"] },
          { title: "Vermut に探させる", body: ["Vermut › 設定 › D3DMetal を開きます。Vermut がよくある場所を探します。見つからない場合は Point to location… をクリックし、redist/lib フォルダを選びます。"] },
          { title: "ゲームを D3DMetal に切り替える", body: ["ライブラリでゲームを選び、⌥⌘I でゲーム設定を開いて Graphics backend を D3DMetal にします。ボトル全体に適用するなら、ボトルの Graphics タブで設定します。"] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "正直な制限",
        bullets: [
          ["Vermut では、D3DMetal は Steam と Epic のボトルで使えます。Vermut が D3DMetal を改変したり再配布したりすることはありません。"],
          ["すべての DirectX 12 ゲームが動くわけではなく、重いゲームには強力な GPU が必要です。無印の M チップでは設定を下げる前提で考えてください。"],
          ["カーネルレベルのアンチチートを使うゲームは、どのグラフィックスレイヤーでも動きません。"],
          ["起動後にクラッシュする場合は DXMT と比べてみてください。DirectX 11 モードの方が安定するゲームもあります。"],
        ],
      },
    ],
    faq: [
      { q: "D3DMetal は無料ですか？", a: ["はい。Game Porting Toolkit は無料の Apple アカウントで Apple から無料でダウンロードできます。"] },
      { q: "Vermut に D3DMetal が同梱されていないのはなぜ？", a: ["Apple のライセンスでアプリへの同梱が認められていないためです。Apple からダウンロードしたものを Vermut が使います。"] },
      { q: "どのバージョンが必要ですか？", a: ["Vermut には D3DMetal 2.0 以降が必要です。古いバージョンが見つかった場合は、Apple から最新版をダウンロードするよう案内します。"] },
      { q: "Xcode やターミナルは必要ですか？", a: ["いいえ。Vermut を使う場合は .dmg をダウンロードして開き、ライセンスに同意するだけです。"] },
    ],
    sources: [S.gptk, S.gptkDownload, S.gptkReq, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "open-anyway-unnotarized-app-mac",
    label: "Vermut を初めて開く（このまま開く）",
    metaTitle: "Apple がアプリを確認できない？「このまま開く」で Vermut を開く",
    description:
      "macOS が Vermut を確認できない理由と、Sonoma、Sequoia 以降で「プライバシーとセキュリティ」の「このまま開く」を使って安全に開く方法。ダウンロードの確認方法も。",
    h1: "macOS で Vermut を初めて開く",
    answer: [
      "macOS が初回起動時に Vermut をブロックするのは、マルウェアが含まれているからではなく、有料の Apple Developer ID による公証をまだ受けていない無料アプリだからです。一度開いて「完了」をクリックし、「システム設定」›「プライバシーとセキュリティ」で Vermut に関するメッセージの横にある「このまま開く」をクリックし、Touch ID またはパスワードで確認します。その後は普通に開けます。macOS Sequoia 以降は、Control キーを押しながらクリック ›「開く」ではこの手順を省けません。",
    ],
    sections: [
      {
        id: "why",
        title: "macOS が警告する理由",
        body: [
          ["Gatekeeper は、アプリが Apple Developer ID で署名され、Apple の公証を受けているかを確認します。公証には有料のデベロッパメンバーシップが必要です。Vermut は MIT ライセンスの無料プロジェクトで、まだ公証を受けていないため、「Vermut にマルウェアが含まれていないことを Apple は確認できませんでした」のような警告が表示されます。"],
          ["この警告は Apple がアプリを確認していないという意味で、問題が見つかったという意味ではありません。ソースコードはすべて GitHub で読めますし、ダウンロードしたファイルをダウンロードページやリリースノートに記載の SHA-256 と照合できます。"],
        ],
      },
      {
        id: "steps",
        title: "Vermut を開く手順",
        steps: [
          { title: "「アプリケーション」から Vermut を開く", body: ["DMG から Vermut を「アプリケーション」にドラッグして開きます。警告が表示されたら、「ゴミ箱に入れる」ではなく「完了」をクリックします。"] },
          { title: "「プライバシーとセキュリティ」で「このまま開く」をクリック", body: ["アップルメニュー ＞「システム設定」＞「プライバシーとセキュリティ」と選択し、「セキュリティ」までスクロールして、Vermut に関するメッセージの横の「このまま開く」をクリックします。このボタンは手順 1 の後、約 1 時間表示されます。"] },
          { title: "もう一度「このまま開く」をクリック", body: ["確認ダイアログが表示されたら「このまま開く」をクリックします。"] },
          { title: "Touch ID またはパスワードで確認", body: ["macOS が Vermut を例外として保存します。次回からはダブルクリックだけで開けます。"] },
        ],
      },
    ],
    after: [
      {
        id: "check",
        title: "必要なら、先にダウンロードを確認する",
        bullets: [
          ["ターミナルで「ダウンロード」フォルダの DMG に shasum -a 256 を実行し、結果を Vermut のダウンロードページの SHA-256 と比べます。"],
          ["Vermut は GitHub のリリースか、そこにリンクしている公式サイトからだけダウンロードしてください。"],
          ["Mac 全体で Gatekeeper を無効にしないでください。「このまま開く」はこのアプリだけを例外にします。"],
        ],
      },
    ],
    faq: [
      { q: "Vermut は安全ですか？", a: ["Vermut はオープンソースなので誰でも動作を確認でき、各リリースには SHA-256 が記載されています。アカウントもテレメトリもありません。macOS の警告は公証についてのもので、脅威が検出されたわけではありません。"] },
      { q: "Control キーを押しながらクリック ›「開く」が使えないのはなぜ？", a: ["Apple が macOS Sequoia でこのショートカットを廃止したためです。代わりに「プライバシーとセキュリティ」の「このまま開く」を使ってください。"] },
      { q: "「このまま開く」が見つかりません。", a: ["まず Vermut を開こうとして「完了」をクリックしてください。ボタンはブロックされた起動の後、約 1 時間しか表示されません。その後「プライバシーとセキュリティ」下部の「セキュリティ」を確認してください。"] },
      { q: "アップデートのたびに必要ですか？", a: ["通常はダウンロードしたコピーごとに 1 回です。新しいバージョンで再び警告が出たら、同じ手順を繰り返してください。"] },
    ],
    sources: [S.appleOpenAnyway, S.appleSafely, S.appleSequoia, S.vermutRelease, S.vermut],
  },

  {
    slug: "wine-bottles-and-game-settings-mac",
    label: "Vermut のボトルとゲームごとの設定",
    metaTitle: "Vermut の Wine ボトル、グラフィックスバックエンド、ゲームごとの設定",
    description:
      "Vermut の Wine ボトルの仕組み：ストアごとに 1 つ、任意の .exe 用のカスタムボトル、そして Wine エンジン、DXMT、DXVK、WineD3D、D3DMetal のゲームごとの設定。",
    h1: "Vermut の Wine ボトルとゲームごとの設定",
    answer: [
      "ボトルとは独立した Windows 環境で、専用の C: ドライブを持つ Wine プレフィックスです。Vermut はストアごとに 1 つ作り、Steam や Epic 以外のプログラム用にカスタムボトルも追加できます。設定は階層になっています。Vermut の設定がデフォルト値を決め、各ボトルがそれを変更でき、1.2 からは各ゲームがゲーム設定（⌥⌘I）でさらに変更できます。「Automatic」は常に継承された値を表示します。",
    ],
    sections: [
      {
        id: "layers",
        title: "設定・ボトル・ゲーム：階層の仕組み",
        bullets: [
          ["設定（⌘,）にはデフォルト値があります：Wine エンジン、グラフィックスバックエンド、DXMT のバージョン、ログレベル。"],
          ["ボトルは、ページで変更するまでこれらの値を使います。ストアのボトルには、Windows のバージョン（10、8.1、7）、高解像度モード、winecfg、Finder で開くボトルの C: ドライブ、ログ、診断もあります。"],
          ["ゲームは、ゲーム設定で上書きするまでボトルの値を使います。変更はそのゲームだけに適用されます。"],
          ["エンジンを変えてもゲームやセーブデータには影響しません。ストアが開いている場合、変更は次に開いたときに反映されます。"],
        ],
      },
      {
        id: "backends",
        title: "どのグラフィックスバックエンドを使うか",
        bullets: [
          ["DXMT（デフォルト）：DirectX 10 と 11 を直接 Metal に変換します。Vermut は設定 › Components で複数の DXMT バージョンを管理するので、ゲームを古いバージョンに固定できます。"],
          ["DXVK と MoltenVK：Vulkan 経由で DirectX 9〜11 を扱います。Wine Staging が必要で、Vermut が自動で選びます。"],
          ["WineD3D：Wine 独自のレイヤーで OpenGL を使います。遅めですが、古いゲームでは最も互換性が高いことがあります。"],
          ["D3DMetal：Apple の DirectX 12 レイヤーで、Game Porting Toolkit をインストールすると使えます。", { text: "Mac で DirectX 12 ゲーム", href: "/ja/directx-12-games-on-mac-d3dmetal" }, "を参照してください。"],
        ],
      },
      {
        id: "steps",
        title: "よくある操作",
        steps: [
          { title: "ゲームの設定を変える", body: ["ライブラリでゲームを選び、⌥⌘I（View › Game Settings）を押します。Wine エンジン、グラフィックスバックエンド、DXMT のバージョン、ログレベルを選ぶか、Automatic のままにします。"] },
          { title: "カスタムボトルを作る", body: ["⇧⌘N（File › New Bottle…）を押します。名前を付け、エンジン、グラフィックスバックエンド、Windows のバージョンを選ぶか、Automatic のままにします。"] },
          { title: "Windows のインストーラを実行する", body: ["カスタムボトルで Run .exe or Installer…（⌘O）をクリックし、.exe または .msi を選びます。ツールバーの Run .exe も使えます。"] },
          { title: "ボトルが壊れたらやり直す", body: ["ボトルのページで Reset bottle を使います。そのボトルとインストール済みのゲームが削除されます。ストアのアカウントやクラウドセーブはそこには保存されていません。"] },
        ],
      },
    ],
    faq: [
      { q: "Whisky や CrossOver のボトルを読み込めますか？", a: ["いいえ。Vermut は独自のボトルを作ります。Vermut でストアをインストールし、ゲームを再ダウンロードしてください。"] },
      { q: "ゲームはどこにありますか？", a: ["各ボトルの C: ドライブの中です。ボトルのページから開くと Finder でファイルを確認できます。ゲームは内蔵 SSD で動かすのが最適です。"] },
      { q: "ログレベルは何のためのものですか？", a: ["Wine がログに書く情報量を決めます。GitHub でバグを報告するときに上げ、終わったら Automatic に戻してください。"] },
      { q: "GOG Galaxy のボトルはありますか？", a: ["まだありません。Vermut 1.2 では GOG Galaxy は Coming soon と表示されています。"] },
    ],
    sources: [S.vermutRelease, S.vermut, S.dxmt, S.gptk, S.gcenxWine],
  },
];
