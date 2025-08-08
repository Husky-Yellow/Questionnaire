import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutView from '../AboutView.vue'

describe('AboutView', () => {
  it('should render properly', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.find('.about').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('This is an about page')
  })

  it('should have correct styling classes', () => {
    const wrapper = mount(AboutView)
    const aboutDiv = wrapper.find('.about')
    expect(aboutDiv.exists()).toBe(true)
  })
})
