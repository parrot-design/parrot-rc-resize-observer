import webpack = require("webpack");
export const mode: string;
export namespace entry {
    const react: string[];
}
export namespace output {
    const path: string;
    const filename: string;
    const publicPath: string;
}
export namespace module {
    const rules: ({
        test: RegExp;
        enforce: string;
        use: {
            loader: string;
        }[];
    } | {
        test: RegExp;
        use: {
            loader: string;
            options: {
                transpileOnly: boolean;
            };
        }[];
        enforce?: undefined;
    })[];
}
export namespace resolve {
    const extensions: string[];
}
export const plugins: (webpack.HotModuleReplacementPlugin | webpack.NoEmitOnErrorsPlugin)[];
