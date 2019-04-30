# API Documents
フロントエンドとバックエンドを連結させる時に使うや〜つ

## Users
ユーザー情報やその関連を扱うAPIをまとめてる   

**ユーザー登録**
```
POST: /api/users/create
```
**Request**   
- name: String 名前
- phoneNo: String - required 現実の電話番号
- inAppPhoneNo: String - require アプリ内電話番号(6桁)
- password: String - require パスワード

**Response**
```json:
{
  ok: 1,
  user: {
    name,
    inAppPhoneNo,
    authToken: 'XXXXX' // 認証が必要なAPIに必要
  }
}
```

## Message

飽きた()