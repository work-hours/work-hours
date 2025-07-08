// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function AppLogoIcon(props ) {
    return (
        <img src={'/logo.png'} alt="App Logo" {...props} />
    );
}
