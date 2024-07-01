/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = 'black';/* #fff */

export const Colors = {
  light: {
    text: 'black',/* #11181C */
    background: 'black',/* #fff */
    tint: tintColorLight,
    icon: 'black',/* #687076 */
    tabIconDefault: 'black',/* #687076 */
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: 'blue', /* #ECEDEE */
    background: '#151718',
    tint: tintColorDark,
    icon: 'blue', /* #9BA1A6 */
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
