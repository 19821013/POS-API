"use client"; // クライアントコンポーネントとしてマーク

import React, { useState } from 'react';

const HomePage = () => {
  const [productCode, setProductCode] = useState(''); // 商品コードの状態
  const [productInfo, setProductInfo] = useState(null); // 商品情報の保存
  const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージの保存
  const [purchaseList, setPurchaseList] = useState([]); // 購入リストの状態
  const [totalAmount, setTotalAmount] = useState(0); // 合計金額の状態
  const [showPopup, setShowPopup] = useState(false); // ポップアップの表示状態

  // 商品コードに基づいて商品情報を取得
  const handleReadCode = async () => {
    if (!productCode) {
      setErrorMessage("商品コードを入力してください。");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products?code=${productCode}`);
      const data = await response.json();

      if (data) {
        setProductInfo(data); // 商品情報の保存
        setErrorMessage('');
      } else {
        setProductInfo(null);
        setErrorMessage('商品がマスタ未登録です。');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setErrorMessage('商品情報の取得中にエラーが発生しました。');
    }
  };

  // 購入リストに商品を追加
  const handleAddToList = () => {
    if (productInfo) {
      setPurchaseList((prevList) => [...prevList, productInfo]); // 購入リストに商品を追加
      setProductCode(''); // 入力フィールドをリセット
      setProductInfo(null); // 商品情報をリセット
      setErrorMessage('');
    }
  };

  // 購入ボタンが押されたときの処理
  const handlePurchase = async () => {
    if (purchaseList.length === 0) {
      setErrorMessage("購入リストに商品がありません。");
      return;
    }

    try {
      const purchaseData = {
        cashierCode: 'your_cashier_code', // 適切な値を設定してください
        storeCode: '30',                   // 固定値の例（必要に応じて変更）
        posMachineId: '90',                // 固定値の例（必要に応じて変更）
        productList: purchaseList,         // 購入リストのデータ
      };

      const response = await fetch('http://localhost:5000/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      const result = await response.json();
      if (result.success) {
        setTotalAmount(result.totalAmount); // 合計金額を設定
        setShowPopup(true); // ポップアップを表示
        setPurchaseList([]); // 購入後、リストをクリア
      } else {
        setErrorMessage("購入に失敗しました。");
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      setErrorMessage('購入処理中にエラーが発生しました。');
    }
  };

  // ポップアップを閉じ、リセット処理
  const handleClosePopup = () => {
    setShowPopup(false); // ポップアップを非表示
    setProductCode(''); // 入力フィールドをリセット
    setProductInfo(null); // 商品情報をリセット
    setErrorMessage(''); // エラーメッセージをクリア
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>商品コード入力</h1>
      <input
        type="text"
        placeholder="コード入力"
        value={productCode}
        onChange={(e) => setProductCode(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '10px',
          border: '2px solid #ccc',
          borderRadius: '4px'
        }}
      />
      <button
        onClick={handleReadCode}
        style={{
          padding: '10px',
          width: '100%',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        商品コード 読み込み
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {productInfo && (
        <div style={{ marginTop: '20px' }}>
          <h2>商品情報</h2>
          <p><strong>名称:</strong> {productInfo.productName}</p>
          <p><strong>コード:</strong> {productInfo.productCode}</p>
          <p><strong>単価:</strong> {productInfo.unitPrice} 円</p>

          <button
            onClick={handleAddToList}
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '100%'
            }}
          >
            追加
          </button>
        </div>
      )}

      {purchaseList.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>購入リスト</h2>
          <ul>
            {purchaseList.map((item, index) => (
              <li key={index}>
                {item.productName} (単価: {item.unitPrice} 円)
              </li>
            ))}
          </ul>

          <button
            onClick={handlePurchase}
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '100%'
            }}
          >
            購入
          </button>
        </div>
      )}

      {/* ポップアップの実装 */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '0', left: '0',
          right: '0', bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <h2>購入成功！</h2>
            <p>合計金額: {totalAmount} 円（税込）</p>
            <button
              onClick={handleClosePopup}
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;