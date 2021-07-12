export interface BaseImage {
    url: string;
    width: string;
    height: string;
}

export interface Image extends BaseImage {
    id: number;
}
