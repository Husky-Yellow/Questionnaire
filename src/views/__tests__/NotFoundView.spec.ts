import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '../NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/404', component: NotFoundView },
  ],
})

describe('NotFoundView', () => {
  it('should render 404 content', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('h1').text()).toBe('404')
    expect(wrapper.find('p').text()).toBe('页面未找到')
    expect(wrapper.find('.home-link').exists()).toBe(true)
  })

  it('should have correct link to home', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [router],
      },
    })

    const homeLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(homeLink.props('to')).toBe('/')
    expect(homeLink.text().trim()).toBe('返回首页')
  })
})
