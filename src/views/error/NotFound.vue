<template>
    <div class="not-found">
        <div class="content">
            <h1>404</h1>
            <h2>Úi! Trang không tồn tại</h2>
            <p>Có vẻ như đường dẫn bạn truy cập đã bị xóa hoặc không còn tồn tại.</p>
            <router-link to="/" class="back-home">Về trang chủ</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #f8f9fa;
    font-family: 'Inter', sans-serif;
}

.content h1 {
    font-size: 8rem;
    margin: 0;
    color: #2d3436;
    line-height: 1;
}

.content h2 {
    font-size: 2rem;
    color: #636e72;
    margin-bottom: 1rem;
}

.content p {
    color: #b2bec3;
    margin-bottom: 2rem;
}

.back-home {
    display: inline-block;
    padding: 0.8rem 2rem;
    background-color: #0984e3;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.3s ease;
}

.back-home:hover {
    background-color: #00cec9;
}
</style>
