import Image from "next/image";
import { tv, VariantProps } from 'tailwind-variants';

const logo = tv({
  base: 'w-full h-full relative',
});

export const Logo = () => {
  return (
    <Image
      src={`./logo.svg`}
      alt="Buckify logo"
      layout='fill'
      objectFit='contain'
    />
  );
};