# 源私有文件系统

File System 标准引入了源私有文件系统（OPFS），作为页面的源的私有且用户不可见的存储后端，它提供了对一种特殊文件的可选访问，并对性能进行了高度优化。

> **庆祝**  
> 源私有文件系统允许 Web App 在自己特定的源虚拟文件系统中存储和操作文件，包括低级文件操作、逐字节访问和文件流。 所有主要浏览器都支持源私有文件系统。

## 浏览器支持

源私有文件系统被现代浏览器支持，并由网络超文本应用程序技术工作组（[WHATWG](https://whatwg.org/)）标准化为 [File System Living Standard](https://fs.spec.whatwg.org/)。

![浏览器兼容性](https://jihulab.com/zhoushengdao/zhoushengdao-articles/-/raw/main/origin-private-file-system/bcd.svg?ref_type=heads)

## 动机

提到计算机上的文件，你可能会想到这样的文件层次结构：文件被组织在文件夹中——你可以用操作系统的文件资源管理器来查看。 例如，在 Windows 上，对于一个名为 Tom 的用户，他的待办事项列表可能位于 `C:\Users\Tom\Documents\ToDo.txt`。 在这个示例中，`ToDo.txt` 是文件名，`Users`、`Tom` 和 `Documents` 是文件夹名。 Windows 上的 `C:\` 表示驱动器的根目录。

> 在本文中，我交替使用_文件夹_和_目录_这两个术语，而忽略了文件系统概念（目录）和图形用户界面[隐喻](https://en.wikipedia.org/wiki/Directory_%28computing%29#Folder_metaphor)（文件夹）之间的区别。

### 在 Web 上处理文件的传统方式

若要在 Web App 中编辑待办事项列表，这是传统的流程：

1. The user _uploads_ the file to a server or _opens_ it on the client with [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file).
1. The user makes their changes, and then _downloads_ the resulting file with an injected [`<a download="ToDo.txt>`](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/download) that you programmatically [`click()`](https://developer.mozilla.org/docs/Web/API/HTMLElement/click) via JavaScript.
1. 对于开启文件夹，您在 [`<input type="file" webkitdirectory>`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory)中使用一个特殊属性，尽管它有专有名称，但它实际上具有通用的浏览器支持。

### 网络上文件的现代工作方式

此流不代表用户对编辑文件的看法， 这意味着用户最终下载了 _副本。他们输入文件的_ 副本。 因此，文件系统访问 API 引入了三种选择方法 — —[`showOpenFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showOpenFilePicker), [`显示SaveFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showSaveFilePicker) [`showDirectoryPicker()`](https://developer.mozilla.org/docs/Web/API/Window/showDirectoryPicker) 它们能够产生如下流量：

1. 打开 `To.txt` with `showOpenFilePicker()`, 并获得一个 [`FileSystemFile Handle`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle) 对象。
1. 从 `FileSystemFileHandle` object, 获得一个 [``](https://developer.mozilla.org/docs/Web/API/File) 通过调用文件句柄的 [`getFile()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/getFile) 方法.
1. Modify the file, then call [`requestPermission({mode: 'readwrite'})`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/requestPermission) on the handle.
1. 如果用户接受权限请求，将更改保存到原始文件。
1. 或者，调用 `showveFilePicker()` 并让用户选择一个新的文件。 (如果用户选择以前打开的文件，其内容将被覆盖) 若要重复保存，您可以保持文件处理方式，所以您不必再次显示文件保存对话框。

### 限制网络上的文件工作

通过这些方法可以访问的文件和文件夹生活在可以被称为 _用户可见的_ 文件系统中。 Files saved from the web, and executable files specifically, are marked with the [mark of the web](https://textslashplain.com/2016/04/04/downloads-and-the-mark-of-the-web/), so there's an additional warning the operating system can show before a potentially dangerous file gets executed. 作为额外的安全功能，从网页上获取的文件也受到 [Safe Browsing](https://safebrowsing.google.com/)的保护。 为了简洁和本条的背景，你可以将其视为基于云层的病毒扫描。 当您使用文件系统访问 API 将数据写入文件时，写入不是现场，但使用临时文件。 文件本身不会被修改，除非它通过所有这些安全检查。 As you can imagine, this work makes file operations relatively slow, despite improvements applied where possible, for example, [on macOS](https://bugs.chromium.org/p/chromium/issues/detail?id=1413443). Still every [`write()`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/write) call is self-contained, so under the hood it opens the file, seeks to the given offset, and finally writes data.

### 作为处理基础的文件

同时，档案是记录数据的极好方式。 例如， [SQLite](https://www.sqlite.org/) 将整个数据库存储在单个文件中。 另一个例子是用于图像处理的 [mipmap](https://en.wikipedia.org/wiki/Mipmap)。 Mipmap是预计算的，优化图像序列， 其中每一种都是前一种逐渐降低的分辨率，从而使得许多操作像缩放得更快。 所以，网络应用程序如何能够从文件中获得好处，但不需要传统的网络文件处理的性能成本？ 答案是 _原始私有文件系统_。

## 用户可见性与原始私有文件系统

不同于通过操作系统文件浏览器浏览的用户可见的文件系统，您可以读取文件和文件夹， 撰写、移动和重命名原始私有文件系统并不意味着用户会看到。 原始私有文件系统中的文件和文件夹，正如名称所建议的那样是私密的 更具体而言，私下访问站点的 [原点](https://developer.mozilla.org/docs/Glossary/Origin)。 在 DevTools 控制台中输入 [`位置。来源`](https://developer.mozilla.org/docs/Web/API/Location/origin) 来发现页面的原始位置。 For example, the origin of the page `https://developer.chrome.com/articles/` is `https://developer.chrome.com` (that is, the part `/articles` is _not_ part of the origin). 您可以阅读更多关于原产地理论的信息，见 [Understanding "some-site" and "some-origin"](https://web.dev/same-site-same-origin/#origin)。 所有共享相同来源的页面都可以看到相同来源的私有文件系统数据，所以 `https://developer。 hrome.com/docs/extensions/mv3/getstarted/extensions-101/` 可以看到与前一个例子相同的细节。 每个原产地都有自己独立的原产地私有文件系统，这意味着 `https://developer的原始私有文件系统。 hrome.com` 完全不同于如 [`https://web.dev`](https://web.dev/) 在 Windows 上，用户可见文件系统的根目录是 ``C:\`。 原始私有文件系统的对应方式是调用异步方法 [``navigator.storage.getDirectory()`](https://developer.mozilla.org/docs/Web/API/StorageManager/getDirectory) 访问的初始空根目录。 关于用户可见文件系统与原始私有文件系统的比较，请见下图表。 图表显示，除根目录外，其他所有东西在概念上都是一样的， 具有文件和文件夹的层次结构，以根据您的数据和存储需要组织和安排。

<!-- https://web-dev.imgix.net/image/8WbTDNrhLsU0El80frMBGE4eMCD3/xej6CL5VFJuGJgXPkeKJ.png?auto=format&w=1600 -->

![显示用户可见文件系统和原始私有文件系统的两个模范文件层次图。 用户可见文件系统的入口是一个符号硬盘， 原始私有文件系统的入口点正在调用方法“导航器”。 torage.getDirectory。](/img/bVc9o5U)

## 原始私有文件系统的特点

Just like other storage mechanisms in the browser (for example, [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) or [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Using_IndexedDB)), the origin private file system is subject to browser quota restrictions. 当用户 [清除所有浏览数据](https://support.google.com/chrome/answer/2392709) 或 [所有站点数据](https://developer.chrome.com/docs/devtools/storage/cache/#deletecache)时，原始私密文件系统也将被删除。 调用 [`navigator.storage。 估计值()`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate) 以及在结果的响应对象中请参阅 [`使用率`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate#usage) 条目以查看您的应用已经消耗了多少存储空间 [`用法明细`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate#usagedetails) 对象， 在哪里您想要查看 `文件系统` 条目。 由于原始私有文件系统对用户不可见，没有权限提示和安全浏览检查。

## 正在获取访问根目录

要访问根目录，请运行下面的命令。 你最后有一个空的目录句柄，更具体而言，一个 [`FileSystemDirectoryHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle)。

```js
const opfsRoot = 等待navigator.storage.getDirectory();
// A FileSystemDirectoryHandle 的类型是“directory”
// 其名称为""。
log(opfsRoot)；
```

## 主线程或Web Worker

有两种方法使用原始私有文件系统：在 [主线程](https://developer.mozilla.org/docs/Glossary/Main_thread) 或 [Web Worker](https://developer.mozilla.org/docs/Web/API/Worker) 中。 Web Workers 不能屏蔽主线程，这意味着这里的 API 可以同步，这种模式在主线程上一般不允许。 同步API可以更快，因为它们避免必须兑现许诺， 和文件操作通常是同步的语言，如C，可以编译到WebAssembly。

```c
// 这是同步的 C 代码。
FILE *f;
f = fopen("example.txt", "w+");
sputs("Some text\n", f);
fclose(f);
```

If you need the fastest possible file operations and/or you deal with [WebAssembly](https://developer.mozilla.org/es/docs/WebAssembly), skip down to [Using the origin private file system in a Web Worker](https://example.com). 其他，您可以读取了。

## 在主线程上使用原始私有文件系统

### 创建新文件和文件夹

一旦你有一个根目录， 使用 [`getFileHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle) 和 [`getDirectoryHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getDirectoryHandle) 方法创建文件和文件夹。 通过 [`{create: true}`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle#create)如果文件或文件夹不存在，它将被创建。 使用新创建的目录作为起点，调用这些函数来建立一个文件的层次结构。

```js
const fileHandle = await opfsRoot.getFileHandle("my first file", {
  create: true,
});
const directoryHandle = await opfsRoot.getDirectoryHandle("my first folder", {
  create: true,
});
const nestedFileHandle = await directoryHandle.getFileHandle(
  "my first nested file",
  { create: true },
);
const nestedDirectoryHandle = await directoryHandle.getDirectoryHandle(
  "my first nested folder",
  { create: true },
);
```

<!-- https://web-dev.imgix.net/image/8WbTDNrhLsU0El80frMBGE4eMCD3/VtWQ4T2a1gph0kFzhRwN.png?auto=format -->

![从先前的代码样本中生成的文件层次结构。](/img/bVc9o5E)

### 访问现有文件和文件夹

如果您知道他们的名字， 通过调用 `getFileHandle()` 或 `getDirectoryHandle()` 方法访问先前创建的文件和文件夹 在文件或文件夹中传递。

```js
const existingFileHandle = 等待opfsRoot.getFileHandle('我的第一个文件');
const existingDirectoryHandle = 等待opfsRoot
    .getDirectoryHandle('我的第一个文件夹);
```

### 正在获取与文件句柄相关联的文件进行读取

`FileSystemFileHandle` 表示文件系统中的一个文件。 要获取关联的 `文件`，请使用 [`getFile()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/getFile) 方法。 `文件` 对象是特定类型的 [`Blob`](https://developer.mozilla.org/es/docs/Web/API/Blob), 并且可以在一个 `Blob` 能够使用的任何上下文中。 In particular, [`FileReader`](https://developer.mozilla.org/es/docs/Web/API/FileReader), [`URL.createObjectURL()`](https://developer.mozilla.org/es/docs/Web/API/URL/createObjectURL), [`createImageBitmap()`](https://developer.mozilla.org/es/docs/Web/API/createImageBitmap), and [`XMLHttpRequest.send()`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/send) accept both `Blobs` and `Files`. 如果您愿意，请从 `FileSystemFileHandle` 获取一个 `文件` 。 这样您可以访问它并将它提供给用户可见的文件系统。

```js
const 文件 = 等待文件 Handle.getFile();
console.log(等待文件.text(); );
```

### 正在通过串流写入文件

调用 [`createWritable()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createWritable) 将数据导入到一个文件中，创建一个 [`FileSystemWritableFileStream`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream) 将数据导入一个文件，然后是 [`write()`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/write) 内容。 最后，您需要 [`close()`](https://developer.mozilla.org/docs/Web/API/WritableStream/close) 串流。

```js
const contents = "Some text";
// 获取一个可写流.
const writable = 等待 fileHandle.createWritable();
// 写入文件流的内容。
正在等待写入.write(contents);
// 关闭仍然存在内容的流。
等待写入.close();
```

### 正在删除文件和文件夹

通过调用文件或目录句柄的特殊的 [`remove()`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/remove) 方法来删除文件和文件夹。 To delete a folder including all subfolders, pass the [`{recursive: true}`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/remove#recursive) option.

```js
正在等待 fileHandle.remove();
正在等待 directoryHandle.remove({ recursive: true });
```

> `remove()` 方法目前仅在 Chrome 中实现。 You can feature-detect support via `'remove' in FileSystemFileHandle.prototype`.

作为替代，如果您知道要删除的文件或文件夹在目录中的名称，请使用 [`removeEntry()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/removeEntry) 方法。

```js
directoryHandle.removeEntry("我的第一个嵌套文件");
```

> 作为一个快速提示, `正在等待 (等待 navigator.storage.getDirectory().remove({recursive: true})` 是清除整个原始私有文件系统的最快方式。

### 移动和重命名文件和文件夹

使用 [`move()`](https://github.com/whatwg/fs/pull/10) 方法重命名并移动文件和文件夹。 移动和重命名可能同时发生或孤立发生。

```js
// Rename a file.
正在等待 fileHandle.move("我的第一个重命名文件");
// 将一个文件移动到另一个目录。
正在等待 fileHandle.move(嵌套的DirectoryHandle);
// 移动一个文件到另一个目录并重命名它。
正在等待文件处理。 ove(
  嵌套目录手法，
  "我的第一个重命名和现在嵌套的文件",
);
```

> 重命名和移动文件夹在 Chrome 中尚未实现。 您也不能将文件从原始私有文件系统移动到用户可见文件系统。 You can [copy](#copying-a-file-from-the-origin-private-file-system-to-the-user-visible-file-system) them, though.

### 解析文件或文件夹的路径

了解指定的文件或文件夹相对于参考目录的位置， 使用 [`解决(format@@2`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/resolve) 方法, 通过一个 `FileSystemHandle` 作为参数。 获取原始私有文件系统中的文件或文件夹的完整路径， 使用根目录作为通过 `导航器获取的参考目录。 torage.getDirectory()`

```js
const relativePath = 等待opfsRoot.resolve(destedDirectoryHandle);
// `relativePath` 是 `[我的第一个文件夹', '我的第一个嵌套文件夹']'。
```

### 检查两个文件或文件夹是否处理到同一个文件或文件夹的点

有时你有两个句柄，不知道它们指向同一个文件或文件夹。 若要检查是否属实，请使用 [`isSameEntry()`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/isSameEntry) 方法。

```js
fileHandle.isSameEntry(嵌套FileHandle);
// 返回 `false` 。
```

## 列出文件夹的内容

`FileSystemDirectoryHandle` 是一个 [异步迭代器](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) 你用 [`迭代，等待…的`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for-await...of) 循环。 作为异步迭代器，它还支持 [`<code>`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/entries), [`值()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/values), [`keys()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/keys) 方法，您可以根据您需要的信息选择：

<!-- prettier-ignore-start -->
```js
等待(let [name, handle] of directoryHandle) {}
等待(let [name, handle] of directoryHandle. ntries()) {}
等待(let serve of directoryHandle.values()) {}
等待(let name of directoryHandle.keys()) {}
```
<!-- prettier-ignore-end -->

## 递归列出文件夹和所有子文件夹的内容

处理与递归配对的异步循环和函数很容易发生错误。 下面的函数可以作为列出文件夹及其所有子文件夹内容的起始点。 包括所有文件和它们的大小。 如果你不需要文件大小，你可以简化这个函数，它说了 `directoryEntryPromises。 ush`, 不要推送 `handle.getFile()` 许诺, 但 `直接处理`

```js
const getDirectoryEntriesRecursive = async (
  directoryHandle,
  relativePath = ".",
) => {
  const fileHandles = [];
  const directoryHandles = [];
  const entries = {};
  // Get an iterator of the files and folders in the directory.
  const directoryIterator = directoryHandle.values();
  const directoryEntryPromises = [];
  for await (const handle of directoryIterator) {
    const nestedPath = `${relativePath}/${handle.name}`;
    if (handle.kind === "file") {
      fileHandles.push({ handle, nestedPath });
      directoryEntryPromises.push(
        handle.getFile().then((file) => {
          return {
            name: handle.name,
            kind: handle.kind,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            relativePath: nestedPath,
            handle,
          };
        }),
      );
    } else if (handle.kind === "directory") {
      directoryHandles.push({ handle, nestedPath });
      directoryEntryPromises.push(
        (async () => {
          return {
            name: handle.name,
            kind: handle.kind,
            relativePath: nestedPath,
            entries: await getDirectoryEntriesRecursive(handle, nestedPath),
            handle,
          };
        })(),
      );
    }
  }
  const directoryEntries = await Promise.all(directoryEntryPromises);
  directoryEntries.forEach((directoryEntry) => {
    entries[directoryEntry.name] = directoryEntry;
  });
  return entries;
};
```

## 在 Web Worker 中使用原始私有文件系统

如前所述，网络工人不能屏蔽主线程，这就是为什么在这种情况下允许同步方法。

### 获取同步访问句柄中

最快文件操作的入口点是 [`FileSystemSyncAccessHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle), 从 [`FileSystemFileHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle) 拨打 [`createSyncAccessHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle)

```js
const fileHandle = 等待opfsRoot.getFileHandle("我的高速文件.txt", own
  creat: true,
});
Const SyncAccessHandle = 等待fileHandle.createSyncAccessHandle();
```

> 这可能似乎令人困惑，但你实际上得到了一个 _同步的_ `FileSystemSyncAccessHandle` 来自普通的 `FileSystemFileHandle` 还请注意 `createSyncAccessHandle()` 方法是 _异步_, 尽管 `同步` 名名下。

### 同步文件方法

一旦你有一个同步访问手机，你就可以访问所有同步的快速在地文件方法。

- [`getSize()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/getSize)：返回文件的字节大小。
- [`写入()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/write)写入缓冲区的内容， 在给定的偏移中，并返回写入字节的数量。 检查返回的字节数允许呼叫者侦测和处理错误及部分写入。
- [`read()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/read): 读取该文件的内容到缓冲区，可在给定的偏移处选择。
- [`truncate()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/truncate): 将文件调整到给定的大小。
- [`flush()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/flush): 确保文件的内容包含通过 `write()` 完成的所有修改。
- [`close()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/close): 关闭访问句柄。

以下是一个使用上述所有方法的例子。

```js
const opfsRoot=等待navigator.storage.getDirectory();
const fileHandle = 等待opfsRoot.getFileHandle("fast", { create: true });
const accessHandle = 等待文件处理器。 ReateSyncAccessHandle();

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// 根据文件大小初始化此变量。
允许大小;
// 当前文件大小, 初始`0`.
大小 = accessHandle.getSize();
// 编码内容以写入文件。
const content = textEncoder.encode("Some text");
// 在文件开头写入内容。
accessHandle.write(contents, { at: size });
// 刷新更改。
accessHandle.flush();
// 文件当前大小, 现在`9` ("一些文本"的长度).
大小 = accessHandle.getSize();

// 编码更多内容以写入文件。
const more content = textEncoder.encode("more content");
// 将内容写在文件末尾。
accessHandle.write(更多内容, { at: size });
// 刷新更改。
accessHandle.flush();
// 文件当前大小, 现在`21` (长度为
// "一些文本更多内容").
大小 = accessHandle.getSize();

// 准备文件长度的数据视图。
const data View = new DataView(新 ArrayBuffer(size));

// 读取整个文件到数据视图。
accessHandle.read(data View);
// Logs `"some textMore content".
console.log(textDecoder.decode(dataView));

// Read starting at offset 9 into the data view.
accessHandle.read(dataView, { at: 9 });
// Logs `"更多内容"。
console.log(textDecoder.decode(dataView));

// Truncate the file after 4 bytes.
a. AccessHandle.truncate(4)；
```

> 请注意， `read()` and `write()` 的第一个参数是 [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或 `ArrayBufferView` 就像 [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)。 You cannot directly manipulate the contents of an `ArrayBuffer`. Instead, you create one of the [typed array objects](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) like an [`Int8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) or a `DataView` object which represents the buffer in a specific format, and use that to read and write the contents of the buffer.

## 将原始私有文件系统中的文件复制到用户可见的文件系统

如上所述，将文件从原始私有文件系统移动到用户可见文件系统是不可能的，但您可以复制文件。 既然 `showSaveFilePicker()` 只在主线程上曝光，但不在工人线程中，肯定要在那里运行代码。

```js
/ 在主线程上，而不是在工人。 假定
// `fileHandle` 是你从工人中获取的
// `FileSystemSyncAccessHandle`
// 线程获取的 `FileSystemSyncAccessHandle` 。 请务必先关闭工人线程中的文件。
const fileHandle = 等待opfsRoot。 etFileHandle("fast");
试试一下
  // 在用户可见的文件系统
  // 获得一个新的文件句柄，其名称与原始私有文件系统中的文件相同。
  const saveHandle = await showSaveFilePicker({
    suggestedName: fileHandle.name || "",
  });
  const writable = await saveHandle.createWritable();
  await writable.write(await fileHandle.getFile());
  await writable.close();
} catch (err) {
  console.error(err.name, err.message);
}
```

## 调试原始私有文件系统

直到内置的 DevTools 支持被添加(见 [crbug/1284595](https://crbug.com/1284595)) 使用 [OPFS Explorer](https://chrome.google.com/webstore/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd) Chrome 扩展调试原始私有文件系统。 [上面的屏幕截图直接从扩展开始创建新的文件和文件夹](#creating-new-files-and-folders)。

<!-- https://web-dev.imgix.net/image/8WbTDNrhLsU0El80frMBGE4eMCD3/kmE7qbP61UlLcCxBkMMQ.png?auto=format -->

![Chrome Web Store的OPFS Explorer Chrome DevTools 扩展。](/img/bVc9o6j)

安装扩展后，打开 Chrome DevTools, 选择 **OPFS Explorer** 标签，然后你准备检查文件级别。 点击文件名并通过点击回收站图标删除文件和文件夹，从原始私有文件系统保存文件到用户可见的文件系统。

## 演示模式

在一个 [演示](https://sqlite-wasm-opfs.glitch.me/) 中查看正在操作中的原始私有文件系统(如果您安装了OPFS Explorer扩展)，它将它用作编译到WebAssembly的 SQLite 数据库的后端。 Be sure to check out the [source code on Glitch](https://glitch.com/edit/#!/sqlite-wasm-opfs). 注意下面嵌入的版本如何不使用原始私有文件系统后端 (因为iframe 是交叉来源), 但当你在一个单独的标签页中打开演示时，它是这样的。

## 四. 结论

由WHATWG指定的原始私有文件系统决定了我们如何使用和与网络上的文件交互。 它启用了使用用户可见文件系统无法实现的新案例。 所有主要浏览器供应商——苹果、Mozilla和Google——都已上班并共享一个联合视野。 开发原始私人文件系统在很大程度上是一项协作努力，开发者和用户的反馈对其进展至关重要。 在我们继续完善和改进这一标准的过程中， 欢迎您以问题或拉取请求的形式对 [whatwg/fs 存储库](https://github.com/whatwg/fs) 提供反馈。

## 相关链接

- [文件系统标准速度](https://fs.spec.whatwg.org/)
- [文件系统标准repo](https://github.com/whatwg/fs)
- [原始私有文件系统WebKit 发布的文件系统API](https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/)
- [OPFS 资源管理器扩展](https://chrome.google.com/webstore/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd)

## 鸣谢

This article was reviewed by [Austin Sully](https://github.com/a-sully), [Etienne Noël](https://ca.linkedin.com/in/enoel19), and [Rachel Andrew](https://rachelandrew.co.uk/). Hero image by [Christina Rumpf](https://unsplash.com/@rumpf) on [Unsplash](https://unsplash.com/photos/XWDMmk-yW7Q).
