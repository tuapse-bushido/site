// import { AppImage } from '@/src/shared/ui';
//
// export const defaultColumnRenderers = {
//   image_link: (value: any, item: any) => {
//     const img = safeImage(value);
//
//     return (
//       <td key="image_link" className={clsx(styles.td, styles.imageWrapper)}>
//         {img ? (
//           <AppImage className={styles.image} src={img} alt={item.title ?? ''} width={100} height={75} />
//         ) : (
//           <span className={styles.noImage}>—</span>
//         )}
//       </td>
//     );
//   },
//
//   is_visible: (value: any) => (
//     <td key="is_visible" className={styles.td}>
//       {value ? 'Видимый' : 'Невидимый'}
//     </td>
//   ),
//
//   is_active: (value: any) => (
//     <td key="is_active" className={styles.td}>
//       {value ? 'Доступно' : 'Недоступно'}
//     </td>
//   ),
//
//   is_set: (value: any) => (
//     <td key="is_set" className={styles.td}>
//       {value ? 'Сет' : 'Самостоятельное'}
//     </td>
//   ),
// };
