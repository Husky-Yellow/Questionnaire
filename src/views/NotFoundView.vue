<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>页面未找到</p>
      <router-link to="/" class="home-link"> 返回首页 </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.content h1 {
  font-size: 4rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--color-text);
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-brand);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: var(--color-brand-dark);
}
</style>
