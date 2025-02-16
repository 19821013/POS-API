const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// 商品データのリスト（ハードコーディング）
const products = [
  { productCode: '1234567', productName: 'お茶', unitPrice: 150 },
  { productCode: '2345678', productName: 'コーヒー', unitPrice: 150 },
  { productCode: '3456789', productName: 'ビール', unitPrice: 300 },
];

// 商品マスタ検索のエンドポイント
app.get('/api/products', (req, res) => {
  const code = req.query.code; // クエリパラメータから商品コードを取得
  const product = products.find(p => p.productCode === code); // コードで商品を検索

  if (product) {
    res.json(product); // 商品情報を返す
  } else {
    res.status(404).json({ message: "商品が見つかりません" }); // 商品が見つからない場合は404エラーレスポンス
  }
});

// 購入処理のエンドポイント
app.post('/api/purchase', (req, res) => {
  // 購入処理をここで実装
  const { cashierCode, storeCode, posMachineId, productList } = req.body;

  // 商品リストがあれば合計金額を計算する
  const totalAmount = productList.reduce((total, product) => total + product.unitPrice, 0);

  // 購入処理成功を仮定
  res.json({ success: true, totalAmount });
});

// サーバー起動
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
