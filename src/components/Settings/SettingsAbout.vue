<template>
    <div class="about-settings">
        <div class="about-highlight-tip">
            🎉 感谢支持！关注下方公众号或小红书，获取最新版本更新以及反馈您的建议
        </div>
        <h2 style="margin-top:0;">AI 视频图文创作助手</h2>
        <p style="font-size:1.05rem;line-height:1.7;">
            AI 视频图文创作助手是一款 Web 工具, 基于 AI 大模型, 一键将视频和音频转化为各种风格的文档, 无需登录注册, 前后端本地部署，以极低的成本体验 AI 视频/音频转风格文档服务。
        </p>
        <div style="margin: 12px 0;">
            项目地址：
            <a href="https://github.com/hanshuaikang/AI-Media2Doc" target="_blank" style="color:#357aff;">
                https://github.com/hanshuaikang/AI-Media2Doc
            </a>
        </div>
        <div class="about-qrcodes">
            <div class="about-qrcode-item">
                <div class="about-qrcode-title">公众号</div>
                <img :src="wechatQr" alt="公众号二维码" class="about-qrcode-img" />
            </div>
            <div class="about-qrcode-item">
                <div class="about-qrcode-title">小红书</div>
                <img :src="xiaohongshuQr" alt="小红书二维码" class="about-qrcode-img" />
            </div>
        </div>
    </div>
</template>
<script setup>
const wechatQr = new URL('../../assets/wechat-qr.jpg', import.meta.url).href
const xiaohongshuQr = new URL('../../assets/xiaohongshu-qr.png', import.meta.url).href
</script>
<style scoped>
.about-settings {
    width: 100%;
    max-width: 700px;
    margin: 0;
    color: #1e293b;
    font-size: 15px;
    line-height: 1.7;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 12px;
    padding: 24px 32px 24px 32px;
    text-align: left;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.about-highlight-tip {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #d97706;
    font-size: 16px;
    font-weight: 700;
    border-left: 5px solid #f59e0b;
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 24px;
    margin-top: 0;
    letter-spacing: 0.2px;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
    text-align: left;
}

.about-settings a {
    text-decoration: underline;
    word-break: break-all;
}

.about-qrcodes {
    display: flex;
    gap: 32px;
    margin-top: 24px;
    margin-bottom: 8px;
    justify-content: flex-start;
    align-items: flex-end;
}

.about-qrcode-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
    border: 2px solid #dbeafe;
    padding: 16px 20px 20px 20px;
    transition: all 0.3s ease;
}

.about-qrcode-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;
}

.about-qrcode-title {
    font-size: 15px;
    font-weight: 600;
    color: #3b82f6;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
}

.about-qrcode-img {
    width: 120px;
    height: 120px;
    border-radius: 16px;
    border: 2px solid #fecaca;
    background: #fff;
    object-fit: contain;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
    transition: all 0.3s ease;
}

.about-qrcode-item:hover .about-qrcode-img {
    border-color: #f87171;
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2);
}
</style>
