import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import TheWelcome from '../../components/TheWelcome.vue'

describe('HomeView', () => {
  it('should render properly', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('should contain TheWelcome component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.findComponent(TheWelcome).exists()).toBe(true)
  })
})
