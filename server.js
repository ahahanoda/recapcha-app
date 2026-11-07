const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
// ⚠️ シークレットキーは、後でRenderの管理画面（環境変数）から設定するのでこのままでOKです
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/verify', async (req, res) => {
    const token = req.body['g-recaptcha-response'];
    if (!token) return res.send('<h3>エラー: reCAPTCHAをチェックしてください。</h3>');

    try {
        const response = await axios.post(
            `https://google.com{RECAPTCHA_SECRET}&response=${token}`
        );
        if (response.data.success) {
            res.send('<h3>🎉 認証成功！あなたは人間です。</h3>');
        } else {
            res.send('<h3>❌ 認証失敗：ロボットと判定されました。</h3>');
        }
    } catch (error) {
        res.status(500).send('サーバーエラー');
    }
});

app.listen(PORT);
