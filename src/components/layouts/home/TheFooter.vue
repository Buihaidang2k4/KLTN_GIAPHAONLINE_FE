<script setup lang="ts">
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-vue-next';
</script>

<template>
    <footer class="main-footer">

        <!-- nền trang trí -->
        <div class="footer-bg footer-bg-left"></div>
        <div class="footer-bg footer-bg-right"></div>

        <div class="container">

            <!-- line trang trí -->
            <div class="footer-top-line">
                <span></span>
                <div class="footer-badge">GiaPhaOnline</div>
                <span></span>
            </div>

            <div class="footer-grid">

                <!-- INFO -->
                <div class="footer-info">
                    <h3 class="logo-text">Gia Phả<span>Online</span></h3>

                    <p>
                        Lưu giữ cội nguồn, gắn kết tình thân và xây dựng cây gia phả
                        cho gia đình bạn theo cách hiện đại và trang trọng.
                    </p>

                    <div class="social-links">
                        <a href="#" class="social-icon">
                            <Facebook :size="18" />
                        </a>

                        <a href="#" class="social-icon">
                            <Twitter :size="18" />
                        </a>

                        <a href="#" class="social-icon">
                            <Linkedin :size="18" />
                        </a>
                    </div>
                </div>

                <!-- FEATURES -->
                <div class="footer-links">
                    <h4>Tính năng</h4>

                    <ul>
                        <li><router-link to="/">Trang chủ</router-link></li>
                        <li><router-link to="/family-chart">Cây gia phả</router-link></li>
                        <li><router-link to="/help">Hướng dẫn</router-link></li>
                    </ul>
                </div>

                <!-- DISCOVER -->
                <div class="footer-links">
                    <h4>Khám phá</h4>

                    <ul>
                        <li><router-link to="/about">Về chúng tôi</router-link></li>
                        <li><router-link to="/feedback">Góp ý</router-link></li>
                        <li><router-link to="/privacy">Chính sách bảo mật</router-link></li>
                    </ul>
                </div>

                <!-- CONTACT -->
                <div class="footer-contact">
                    <h4>Liên hệ</h4>

                    <div class="contact-item">
                        <Mail :size="18" />
                        <span>contact@giaphaonline.com</span>
                    </div>

                    <div class="contact-item">
                        <Phone :size="18" />
                        <span>0123 456 789</span>
                    </div>

                    <div class="contact-item">
                        <MapPin :size="18" />
                        <span>Việt Nam</span>
                    </div>

                </div>

            </div>

            <div class="footer-bottom">
                <p>© 2026 Gia Phả Online. Tất cả quyền được bảo lưu.</p>
            </div>

        </div>

    </footer>
</template>

<style scoped>
.main-footer {
    position: relative;
    background: #0f0f0f;
    color: #eae7df;
    padding: 4rem 0 1.5rem;
    border-top: 1px solid rgba(212, 180, 107, 0.2);
    overflow: hidden;
}

.footer-bg {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.08;
    pointer-events: none;
}

.footer-bg-left {
    width: 300px;
    height: 300px;
    background: #c8a968;
    top: -80px;
    left: -120px;
}

.footer-bg-right {
    width: 360px;
    height: 360px;
    background: #6e8f7a;
    bottom: -120px;
    right: -100px;
}

.container {
    max-width: 1280px;
    margin: auto;
    padding: 0 1.5rem;
    position: relative;
    z-index: 2;
}

.footer-top-line {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.5rem;
}

.footer-top-line span {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #c8a968, transparent);
}

.footer-badge {
    padding: .4rem 1rem;
    border: 1px solid rgba(200, 169, 104, .5);
    border-radius: 999px;
    color: #c8a968;
    font-size: .8rem;
    letter-spacing: .2em;
    text-transform: uppercase;
}

.footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
    gap: 2rem;
    margin-bottom: 2.5rem;
}

.logo-text {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
}

.logo-text span {
    color: #c8a968;
}

.footer-info p {
    line-height: 1.7;
    opacity: .8;
    max-width: 420px;
}

.footer-links h4,
.footer-contact h4 {
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
    position: relative;
    padding-bottom: .6rem;
}

.footer-links h4::after,
.footer-contact h4::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: #c8a968;
}

.footer-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-links li {
    margin-bottom: .9rem;
}

.footer-links a {
    text-decoration: none;
    color: #ddd;
    opacity: .8;
    transition: .3s;
}

.footer-links a:hover {
    color: #c8a968;
    transform: translateX(4px);
}

.footer-contact {
    display: flex;
    flex-direction: column;
}

.contact-item {
    display: flex;
    gap: .6rem;
    margin-bottom: .9rem;
    opacity: .85;
}

.contact-item :deep(svg) {
    color: #c8a968;
}

.social-links {
    display: flex;
    gap: .8rem;
    margin-top: 1.4rem;
}

.social-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(200, 169, 104, 0.3);
    transition: .3s;
}

.social-icon:hover {
    background: #c8a968;
    color: #000;
    transform: translateY(-4px);
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.2rem;
    text-align: center;
    font-size: .9rem;
    opacity: .6;
}

/* responsive */

@media (max-width:1024px) {

    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }

}

@media (max-width:640px) {

    .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .logo-text {
        font-size: 1.7rem;
    }

}
</style>