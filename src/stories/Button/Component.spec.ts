import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import Button from "./Component.vue";

const props = {
  label: 'Click me!',
};

const wrapper = mount(Button, { props });


describe('ButtonComponent', () => {
  describe.only('render', () => {
    it('should be a router link', async () => {
      const to = '/test';
      await wrapper.setProps({ to });

      expect(wrapper.html()).toContain(`href="${to}"`);
    });
  });

  describe('props', () => {
    it('should render label', () => {
      expect(wrapper.text()).toBe(props.label);
    });

    it('should render the given type', async () => {
      const type = 'submit';
      await wrapper.setProps({ type });
      
      expect(wrapper.html()).toContain(`type="${type}"`);
    });

    it('should render the given theme', async () => {
      const theme = 'secondary';
      await wrapper.setProps({ theme });

      expect(wrapper.html()).toContain('bg-white');
    });

    it('should render the given size', async () => {
      const size = 'full';
      await wrapper.setProps({ size });

      expect(wrapper.html()).toContain('w-full');
    });

    it('should render the given disabled', async () => {
      const disabled = true;
      await wrapper.setProps({ disabled });

      expect(wrapper.html()).toContain('bg-neutral-100');
    });
  });
});