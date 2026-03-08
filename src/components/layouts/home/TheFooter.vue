<script setup lang="ts">
import { Facebook, Twitter, Linkedin } from 'lucide-vue-next';
</script>

<template>
    <footer class="main-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-info">
                    <h3 class="logo-text">Gia Phả<span>Online</span></h3>
                    <p>Lưu giữ cội nguồn, gắn kết tình thân. Xây dựng và chia sẻ cây gia phả của gia đình bạn một cách
                        dễ dàng và chuyên nghiệp.</p>
                </div>

                <div class="footer-links">
                    <h4>Tính năng</h4>
                    <ul>
                        <li><router-link to="/">Trang chủ</router-link></li>
                        <li><router-link to="/family-chart">Cây gia phả</router-link></li>
                        <li><router-link to="/help">Hướng dẫn</router-link></li>
                    </ul>
                </div>

                <div class="footer-contact">
                    <h4>Liên hệ</h4>
                    <p>Email: contact@giaphaonline.com</p>
                    <p>Phone: 0123 456 789</p>
                    <div class="social-links">
                        <a href="#" class="social-icon" title="Facebook">
                            <Facebook :size="18" />
                        </a>
                        <a href="#" class="social-icon" title="Twitter">
                            <Twitter :size="18" />
                        </a>
                        <a href="#" class="social-icon" title="LinkedIn">
                            <Linkedin :size="18" />
                        </a>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2024 Gia Phả Online. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    </footer>
</template>



<style scoped>
.main-footer {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 3rem 0 1.5rem 0;
    margin-top: auto;
    /* Đẩy footer xuống dưới cùng */
    font-family: 'Inter', sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1.5fr;
    gap: 3rem;
    margin-bottom: 3rem;
}

@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}

.logo-text {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
    color: #fff;
    font-weight: 800;
}

.logo-text span {
    color: #3498db;
}

.footer-info p {
    line-height: 1.6;
    opacity: 0.8;
}

.footer-links h4,
.footer-contact h4 {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    position: relative;
    padding-bottom: 0.5rem;
}

.footer-links h4::after,
.footer-contact h4::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 2px;
    background-color: #3498db;
}

.footer-links ul {
    list-style: none;
    padding: 0;
}

.footer-links li {
    margin-bottom: 0.8rem;
}

.footer-links a {
    color: #ecf0f1;
    text-decoration: none;
    transition: color 0.3s ease;
    opacity: 0.8;
}

.footer-links a:hover {
    color: #3498db;
    opacity: 1;
}

.footer-contact p {
    margin-bottom: 0.8rem;
    opacity: 0.8;
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.social-icon {
    width: 36px;
    height: 36px;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-icon:hover {
    background-color: #3498db;
    transform: translateY(-3px);
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    text-align: center;
    opacity: 0.6;
    font-size: 0.9rem;
}
</style>
