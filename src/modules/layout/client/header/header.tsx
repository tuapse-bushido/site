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
          <Image src={'/logo/logo.png'} alt={'Bushido'} width={180} height={50} priority />
        </Link>

        <nav className={styles.actions} aria-label="Пользовательское меню">
          <ul>
            <li>
              <Link href={'/cart'} className={styles.cart} aria-label={'Корзина'}>
                <CartIcon />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
