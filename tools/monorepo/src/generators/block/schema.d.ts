export interface BlockGeneratorSchema {
    plugin: string;
    name: string;
    variant?: 'dynamic' | 'static';
}
