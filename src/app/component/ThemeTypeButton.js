
import { useTheme } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';

export default function ThemeTypeButton ({ setThemeType }) {
  const { DARK, LIGHT } = { DARK: 'dark', LIGHT: 'light' };
  const themeType = useTheme()?.palette?.type || DARK;
  const opposingTheme = themeType === DARK ? LIGHT : DARK;
  const handleClick = () => setThemeType(opposingTheme);
  const Brightness = themeType === DARK ? BrightnessHighIcon : NightsStayIcon;

  return (
    <Tooltip title='Switch Theme'>
      <IconButton aria-label='Toggle Theme'>
        <Brightness onClick={handleClick} />
      </IconButton>
    </Tooltip>
  );
}
