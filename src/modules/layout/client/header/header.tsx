import { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartIcon } from './icons';
import styles from './header.module.scss';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href={'/'}>
          <Image src={'/logo/logo.png'} alt={'Bushido'} width={180} height={50} />
        </Link>

        <div className={styles.actions}>
          <Link href={'/cart'} className={styles.cart}>
            <CartIcon width={20} height={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};
