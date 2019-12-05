import { bame } from '../src/bame';
import fs from 'fs';
import { join } from 'path';

jest.mock('fs');

afterEach(() => jest.clearAllMocks())

it('should rename with same name if no config set', () => {
    (<jest.Mock>fs.readdirSync).mockReturnValue(['name foo E1', 'name foo E2']);

    bame();

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.renameSync).toHaveBeenCalledTimes(2);
    expect(fs.renameSync).toHaveBeenCalledWith(join(process.cwd(), 'name foo E1'), join(process.cwd(), 'name foo E1'));
    expect(fs.renameSync).toHaveBeenCalledWith(join(process.cwd(), 'name foo E2'), join(process.cwd(), 'name foo E2'));
});

it('should not throw when no file are listed if no config set', () => {
    (<jest.Mock>fs.readdirSync).mockReturnValue(undefined);

    bame();

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.renameSync).not.toHaveBeenCalled();
});

it('should not throw when no file are listed', () => {
    (<jest.Mock>fs.readdirSync).mockReturnValue(undefined);
    
    bame({
        inReg: '(.*)',
        outReg: '{1}',
        cwd: ''
    });

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.renameSync).not.toHaveBeenCalled();
});

it('should rename files that matches the input regex', () => {
    (<jest.Mock>fs.readdirSync).mockReturnValue(['name foo E1', 'name foo E2']);

    bame({
        inReg: '(.*) foo E(.*)',
        outReg: '{1} - {2}',
        cwd: ''
    });

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.renameSync).toHaveBeenCalledTimes(2);
    expect(fs.renameSync).toHaveBeenCalledWith('name foo E1', 'name - 1');
    expect(fs.renameSync).toHaveBeenCalledWith('name foo E2', 'name - 2');
});

it('should not rename files that not matches the input regex', () => {
    (<jest.Mock>fs.readdirSync).mockReturnValue(['name foo E1', 'name foo E2', 'bar']);

    bame({
        inReg: '(.*) foo E(.*)',
        outReg: '{1} - {2}',
        cwd: ''
    });

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.renameSync).toHaveBeenCalledTimes(2);
    expect(fs.renameSync).toHaveBeenCalledWith('name foo E1', 'name - 1');
    expect(fs.renameSync).toHaveBeenCalledWith('name foo E2', 'name - 2');
});

it('should rename dir by default', () => {
    (<jest.Mock>fs.readdirSync).mockReturnValue(['name foo E1', 'name foo E2']);
    (<jest.Mock>fs.statSync).mockReturnValue({ isDirectory: true });

    bame({
        inReg: '(.*) foo E(.*)',
        outReg: '{1} - {2}',
        cwd: ''
    });

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.renameSync).toHaveBeenCalledTimes(2);
    expect(fs.renameSync).toHaveBeenCalledWith('name foo E1', 'name - 1');
    expect(fs.renameSync).toHaveBeenCalledWith('name foo E2', 'name - 2');
});

it('should not rename dir if option is set to false', () => {
    (<jest.Mock>fs.readdirSync).mockReturnValue(['name foo E1', 'name foo E2']);
    (<jest.Mock>fs.statSync).mockReturnValue({ isDirectory: () => true });

    bame({
        inReg: '(.*) foo E(.*)',
        outReg: '{1} - {2}',
        cwd: '',
        options: {
            renameDir: false
        }
    });

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.renameSync).not.toHaveBeenCalled();
});
