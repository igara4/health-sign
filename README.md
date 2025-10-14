# アプリ名　Health Sign

## デモ

- URL https://health-sign.vercel.app
- ユーザー名 test@example.com
- パスワード test1234

## 概要

Health Signは、日々の体調や心身のサインを記録・可視化することでストレスや不調の「予兆」に早く気付き、対処につなげることを目的としたセルフモニタリングアプリです。

## 開発の背景

私は精神障害のある方等の就労支援に10年以上従事してきました。
日々の支援を通じて感じていた大きな課題の一つが「体調のコントロールが難しい方が多い」という点です。

利用者の多くは、無理を重ねてしまったり、体調の変化に気づくのが遅れて不調が悪化してしまうケースが少なくありません。
そのため、体調の変化に早く気づくことができるよう、日々の体調を記録する取り組みを行っていました。

しかし、いざ体調記録を始めても、以下のような課題がありました。

- 紙ベースの記録は義務感となりやすく、負担を感じて継続が難しいという方が一定数いらっしゃる
- 自宅では記録を忘れてしまい、抜けや偏りが生じる
- 一人ひとりに合った体調のサインは異なるにも関わらず、画一的な記録様式になってしまう

こうした背景から、もっと気軽に、かつ個別性を尊重しながら、日々の状態を把握できるツールが必要だと感じ、本アプリの開発に至りました。

障害の有無を問わず、自身の変化に気づくことは多くの人にとって思っているよりも難しい課題だと私自身も感じており、誰にとっても使いやすく、自然に継続できるようなアプリを目指しました。

## 主な機能

✅ 認証機能
![Image](https://github.com/user-attachments/assets/a00f9f8c-f990-42b1-82ba-1e1b6d0a33c0)

✅ 日々の体調を記録
![Image](https://github.com/user-attachments/assets/eac436c0-de14-4901-b8c7-03690103c658)

✅ 自身にあった体調のサインにカスタマイズ
![Image](https://github.com/user-attachments/assets/4090d759-ab5d-4b8f-bdd2-1b231d34e8fb)

✅ 日々の体調サインの記録をスコア化しグラフとして可視化  
![Image](https://github.com/user-attachments/assets/cf8d3501-4cca-4b32-8a06-17613be576b6)

## 今後の実装予定

- ユーザーのオリジナル体調サインを登録、選択する機能
- グラフの表示範囲をタブ選択で1か月や全期間等切り替えする機能
- 任意の日時の体調記録を後から登録する機能
- 体調の変化の傾向をAIで分析して振り返る機能

## 🛠 使用技術

### フロントエンド

- ![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
- ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
- ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

### バックエンド

- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### 認証

- ![Auth.js](https://img.shields.io/badge/Auth.js-3ECF8E?style=for-the-badge&logo=auth0&logoColor=white)

### ツール

- ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
- ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
