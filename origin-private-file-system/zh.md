# 源私有文件系统

文件系统标准（File System Standard）引入了源私有文件系统（OPFS），作为页面源私有的、用户不可见的存储端点，它提供了对一种特殊文件（a special kind of file）的可选访问，并对性能进行了高度优化。

> **庆祝**  
> 源私有文件系统允许网络应用程序在自己特定的源虚拟文件系统中存储和操作文件，包括低级文件操作、逐字节访问和文件流。 所有主要浏览器都支持源私有文件系统。

## 浏览器支持

源私有文件系统被现代浏览器支持，并由网络超文本应用程序技术工作组（[WHATWG](https://whatwg.org/)）标准化为 [File System Living Standard](https://fs.spec.whatwg.org/)。

![浏览器兼容性](https://jihulab.com/zhoushengdao/zhoushengdao-articles/-/raw/main/origin-private-file-system/bcd.svg?ref_type=heads)

## 动机

提到计算机上的文件，你可能会想到这样的文件层次结构：文件被组织在文件夹中——你可以用操作系统的文件资源管理器来查看。 例如，在 Windows 上，对于一个名为 Tom 的用户，他的待办事项列表可能位于 `C:\Users\Tom\Documents\ToDo.txt`。 在这个示例中，`ToDo.txt` 是文件名，`Users`、`Tom` 和 `Documents` 是文件夹名。 Windows 上的 `C:\` 表示驱动器的根目录。

> 在本文中，我交替使用_文件夹_和_目录_这两个术语，而忽略了文件系统概念（目录）和图形用户界面[隐喻](https://en.wikipedia.org/wiki/Directory_%28computing%29#Folder_metaphor)（文件夹）之间的区别。

### 在 Web 上处理文件的传统方式

若要在网络应用程序中编辑待办事项列表，这是传统的流程：

1. 用户将文件_上传_到服务器，或在客户端使用 [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file) _打开_文件。
1. 用户进行编辑，然后通过 JavaScript 以编程方式对注入的 [`<a download="ToDo.txt">`](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/download) 执行 [`click()`](https://developer.mozilla.org/docs/Web/API/HTMLElement/click) 方法来_下载_生成的文件。
1. 要打开文件夹，可以使用 [`<input type="file" webkitdirectory>`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory) 中的特殊属性，尽管它的名称具有私有前缀，但实际上得到了浏览器的普遍支持。

### 在 Web 上处理文件的现代方式

这种流程并不代表用户编辑文件的思维方式，这意味着用户最终只能下载其输入文件的_副本_。 因此，文件系统访问 API（File System Access API）引入了三个选择器方法——[`showOpenFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showOpenFilePicker)、[`showSaveFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showSaveFilePicker) 和 [`showDirectoryPicker()`](https://developer.mozilla.org/docs/Web/API/Window/showDirectoryPicker)，它们的功能和名称一样（译注：它们的功能依次为打开文件、保存文件和打开目录）。 通过它们，可以以如下的流程来处理文件：

1. 使用 `showOpenFilePicker()` 打开 `ToDo.txt`，得到一个 [`FileSystemFileHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle) 对象。
1. 通过调用文件句柄 `FileSystemFileHandle` 对象的 [`getFile()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/getFile) 方法获取 [`File`](https://developer.mozilla.org/docs/Web/API/File)。
1. 编辑文件，然后在句柄上调用 [`requestPermission({ mode: 'readwrite' })`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/requestPermission)。
1. 如果用户接受权限请求，则将更改保存回原始文件。
1. 或者，调用 `showSaveFilePicker()` 让用户选择一个新文件。 （如果用户选择的是之前打开的文件，其内容将被覆盖。） 对于重复保存，可以保留文件句柄，这样就不必再次显示文件保存对话框。

### 在 Web 上处理文件的限制

通过这些方法访问的文件和文件夹位于_用户可见_的文件系统中。 从网络上保存的文件，特别是可执行文件，都会被打上[网络标记](https://textslashplain.com/2016/04/04/downloads-and-the-mark-of-the-web/)，因此在潜在危险文件被执行之前，操作系统会显示额外的警告。 作为一项额外的安全功能，从网络上获取的文件也会受到[安全浏览](https://safebrowsing.google.com/)的保护，为简单起见，在本文中，你可以将其视为基于云的病毒扫描。 当使用文件系统访问 API 向文件写入数据时，写入不是就地写入，而是会使用临时文件。 除非通过所有这些安全检查，否则文件本身不会被修改。 可以想象，即使[在 macOS](https://bugs.chromium.org/p/chromium/issues/detail?id=1413443) 等系统上尽可能地进行了优化，但这些检查还是让文件操作变得相对缓慢。 尽管如此，每个 [`write()`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/write) 调用都是独立的，因此它在后台会打开文件，查找到给定的偏移量，并最终写入数据。

### 作为处理工作基础的文件

同时，文件也是记录数据的绝佳方式。 例如，[SQLite](https://www.sqlite.org/) 将整个数据库存储在一个文件中。 另一个例子是用于图像处理的 [mipmaps](https://en.wikipedia.org/wiki/Mipmap)。 Mipmaps 是经过预先计算和优化的图像序列，每一幅图像都是前一幅图像的分辨率逐渐降低的表示，这使得许多操作（如缩放）变得更快。 那么，网络应用程序如何既能获得文件的优势，又能避免传统网络文件处理的性能成本呢？ 答案是_源私有文件系统_。

## 用户可见文件系统与源私有文件系统的对比

不同于通过操作系统的文件资源管理器浏览的、你可以读取、写入、移动和重命名文件和文件夹的用户可见文件系统，源私有文件系统不会被用户看到。 顾名思义，源私有文件系统中的文件和文件夹是私有的，更具体地说，是网站的[源](https://developer.mozilla.org/docs/Glossary/Origin)的私有文件系统。 在 DevTools 控制台中输入 [`location.origin`](https://developer.mozilla.org/docs/Web/API/Location/origin) 来查找页面的源。 例如，页面 `https://developer.chrome.com/articles/` 的源是 `https://developer.chrome.com`（即 `/articles` _不_是源的一部分）。 你可以在[理解“同站”和“同源”](https://web.dev/same-site-same-origin/#origin)一文中阅读更多关于源理论的内容。 共享相同源的所有页面都可以在源私有文件系统中看到相同的数据，因此 `https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/` 可以看到与上例相同的信息。 每个源都有自己独立的源私有文件系统，这意味着 `https://developer.chrome.com` 的源私有文件系统与 [`https://web.dev`](https://web.dev/) 的源私有文件系统完全不同。 在 Windows 系统中，用户可见文件系统的根目录是 ``C:\`。 而源私有文件系统的相似项是通过调用异步方法 [``navigator.storage.getDirectory()`](https://developer.mozilla.org/docs/Web/API/StorageManager/getDirectory) 得到的每个源的初始的空的根目录。 关于用户可见文件系统与源私有文件系统的比较，请见下图。 从图中可以看出，除了根目录外，其他所有东西在概念上都是一样的，都具有文件和文件夹的层次结构，可以根据数据和存储需要进行组织和排列。

<!-- https://web-dev.imgix.net/image/8WbTDNrhLsU0El80frMBGE4eMCD3/xej6CL5VFJuGJgXPkeKJ.png?auto=format&w=1600 -->

![用户可见文件系统和源私有文件系统的示意图，以及两个示例文件层次结构。 用户可见文件系统的入口点是一个符号硬盘，源私有文件系统的入口点是调用“navigator.storage.getDirectory”方法。](/img/bVc9o5U)

## 源私有文件系统的特点

与浏览器中的其他存储机制（如 [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) 或 [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Using_IndexedDB)）一样，源私有文件系统也受浏览器配额的限制。 当用户[清除所有浏览数据](https://support.google.com/chrome/answer/2392709)或[所有网站数据](https://developer.chrome.com/docs/devtools/storage/cache/#deletecache)时，源私有文件系统也将被删除。 调用 [`navigator.storage。 估计值()`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate) 以及在结果的响应对象中请参阅 [`使用率`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate#usage) 条目以查看您的应用已经消耗了多少存储空间 [`用法明细`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate#usagedetails) 对象， 在哪里您想要查看 `文件系统` 条目。 由于原始私有文件系统对用户不可见，没有权限提示和安全浏览检查。

## 正在获取访问根目录

要访问根目录，请运行下面的命令。 你最后有一个空的目录句柄，更具体而言，一个 [`FileSystemDirectoryHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle)。

```js
const opfsRoot = await navigator.storage.getDirectory();
// 类型为 "directory"、名称为 "" 的 FileSystemDirectoryHandle。
console.log(opfsRoot);
```

## 主线程或 Web Worker

有两种方法使用原始私有文件系统：在 [主线程](https://developer.mozilla.org/docs/Glossary/Main_thread) 或 [Web Worker](https://developer.mozilla.org/docs/Web/API/Worker) 中。 Web Workers 不能屏蔽主线程，这意味着这里的 API 可以同步，这种模式在主线程上一般不允许。 同步API可以更快，因为它们避免必须兑现许诺， 和文件操作通常是同步的语言，如C，可以编译到WebAssembly。

```c
// 这是同步的 C 代码。
FILE *f;
f = fopen("example.txt", "w+");
fputs("Some text\n", f);
fclose(f);
```

If you need the fastest possible file operations and/or you deal with [WebAssembly](https://developer.mozilla.org/es/docs/WebAssembly), skip down to [Using the origin private file system in a Web Worker](https://example.com). 其他，您可以读取了。

## 在主线程上使用原始私有文件系统

### 创建新文件和文件夹

一旦你有一个根目录， 使用 [`getFileHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle) 和 [`getDirectoryHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getDirectoryHandle) 方法创建文件和文件夹。 By passing [`{ create: true }`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle#create), the file or folder will be created if it doesn't exist. 使用新创建的目录作为起点，调用这些函数来建立一个文件的层次结构。

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

![从前面的代码示例中得到的文件层次结构。](/img/bVc9o5E)

### 访问现有文件和文件夹

如果您知道他们的名字， 通过调用 `getFileHandle()` 或 `getDirectoryHandle()` 方法访问先前创建的文件和文件夹 在文件或文件夹中传递。

```js
const existingFileHandle = await opfsRoot.getFileHandle("my first file");
const existingDirectoryHandle =
  await opfsRoot.getDirectoryHandle("my first folder");
```

### 正在获取与文件句柄相关联的文件进行读取

`FileSystemFileHandle` 表示文件系统中的一个文件。 要获取关联的 `文件`，请使用 [`getFile()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/getFile) 方法。 `文件` 对象是特定类型的 [`Blob`](https://developer.mozilla.org/es/docs/Web/API/Blob), 并且可以在一个 `Blob` 能够使用的任何上下文中。 In particular, [`FileReader`](https://developer.mozilla.org/es/docs/Web/API/FileReader), [`URL.createObjectURL()`](https://developer.mozilla.org/es/docs/Web/API/URL/createObjectURL), [`createImageBitmap()`](https://developer.mozilla.org/es/docs/Web/API/createImageBitmap), and [`XMLHttpRequest.send()`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/send) accept both `Blobs` and `Files`. 如果您愿意，请从 `FileSystemFileHandle` 获取一个 `文件` 。 这样您可以访问它并将它提供给用户可见的文件系统。

```js
const file = await fileHandle.getFile();
console.log(await file.text());
```

### 正在通过串流写入文件

调用 [`createWritable()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createWritable) 将数据导入到一个文件中，创建一个 [`FileSystemWritableFileStream`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream) 将数据导入一个文件，然后是 [`write()`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/write) 内容。 最后，您需要 [`close()`](https://developer.mozilla.org/docs/Web/API/WritableStream/close) 串流。

```js
const contents = "Some text";
// 获取一个可写流。
const writable = await fileHandle.createWritable();
// 将文件内容写入数据流。
await writable.write(contents);
// 关闭数据流，保存内容。
await writable.close();
```

### 正在删除文件和文件夹

通过调用文件或目录句柄的特殊的 [`remove()`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/remove) 方法来删除文件和文件夹。 To delete a folder including all subfolders, pass the [`{recursive: true}`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/remove#recursive) option.

```js
await fileHandle.remove();
await directoryHandle.remove({ recursive: true });
```

> `remove()` 方法目前仅在 Chrome 中实现。 You can feature-detect support via `'remove' in FileSystemFileHandle.prototype`.

作为替代，如果您知道要删除的文件或文件夹在目录中的名称，请使用 [`removeEntry()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/removeEntry) 方法。

```js
directoryHandle.removeEntry("my first nested file");
```

> As a quick tip, `await (await navigator.storage.getDirectory()).remove({ recursive: true })` is the fastest way to clear the entire origin private file system.

### 移动和重命名文件和文件夹

使用 [`move()`](https://github.com/whatwg/fs/pull/10) 方法重命名并移动文件和文件夹。 移动和重命名可能同时发生或孤立发生。

```js
// 重命名文件。
await fileHandle.move("my first renamed file");
// 将文件移动到另一个目录。
await fileHandle.move(nestedDirectoryHandle);
// 将文件移动到另一个目录并重命名。
await fileHandle.move(
  nestedDirectoryHandle,
  "my first renamed and now nested file",
);
```

> 重命名和移动文件夹在 Chrome 中尚未实现。 您也不能将文件从原始私有文件系统移动到用户可见文件系统。 You can [copy](#copying-a-file-from-the-origin-private-file-system-to-the-user-visible-file-system) them, though.

### 解析文件或文件夹的路径

了解指定的文件或文件夹相对于参考目录的位置， 使用 [`解决(format@@2`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/resolve) 方法, 通过一个 `FileSystemHandle` 作为参数。 获取原始私有文件系统中的文件或文件夹的完整路径， 使用根目录作为通过 `导航器获取的参考目录。 torage.getDirectory()`

```js
const relativePath = await opfsRoot.resolve(nestedDirectoryHandle);
// `relativePath` 为 `['my first folder', 'my first nested folder']`。
```

### 检查两个文件或文件夹是否处理到同一个文件或文件夹的点

有时你有两个句柄，不知道它们指向同一个文件或文件夹。 若要检查是否属实，请使用 [`isSameEntry()`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/isSameEntry) 方法。

```js
fileHandle.isSameEntry(nestedFileHandle);
// 返回 `false`。
```

## 列出文件夹的内容

`FileSystemDirectoryHandle` 是一个 [异步迭代器](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) 你用 [`迭代，等待…的`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for-await...of) 循环。 作为异步迭代器，它还支持 [`<code>`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/entries), [`值()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/values), [`keys()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/keys) 方法，您可以根据您需要的信息选择：

<!-- prettier-ignore-start -->
```js
for await (let [name, handle] of directoryHandle) {}
for await (let [name, handle] of directoryHandle.entries()) {}
for await (let handle of directoryHandle.values()) {}
for await (let name of directoryHandle.keys()) {}
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
  // 获取目录中文件和文件夹的迭代器。
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

## 在 Web Worker 中使用源私有文件系统

如前所述，网络工人不能屏蔽主线程，这就是为什么在这种情况下允许同步方法。

### 获取同步访问句柄中

最快文件操作的入口点是 [`FileSystemSyncAccessHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle), 从 [`FileSystemFileHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle) 拨打 [`createSyncAccessHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle)

```js
const fileHandle = await opfsRoot.getFileHandle("my highspeed file.txt", {
  create: true,
});
const syncAccessHandle = await fileHandle.createSyncAccessHandle();
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
const opfsRoot = await navigator.storage.getDirectory();
const fileHandle = await opfsRoot.getFileHandle("fast", { create: true });
const accessHandle = await fileHandle.createSyncAccessHandle();

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// 根据文件大小初始化该变量。
let size;
// 文件的当前大小，最初为 `0`。
size = accessHandle.getSize();
// 编码要写入文件的内容。
const content = textEncoder.encode("Some text");
// 将内容写入文件开头。
accessHandle.write(content, { at: size });
// 刷新（flush）更改。
accessHandle.flush();
// 文件的当前大小，现在是 `9`（"Some text"的长度）。
size = accessHandle.getSize();

// 编码更多内容以写入文件。
const moreContent = textEncoder.encode("More content");
// 将内容写入文件末尾。
accessHandle.write(moreContent, { at: size });
// 刷新（flush）更改。
accessHandle.flush();
// 文件的当前大小，现在是 `21`（"Some textMore content"的长度）。
size = accessHandle.getSize();

// 准备文件长度的数据视图。
const dataView = new DataView(new ArrayBuffer(size));

// 将整个文件读入数据视图。
accessHandle.read(dataView);
// 打印 `"Some textMore content"`。
console.log(textDecoder.decode(dataView));

// 从偏移量 9 开始读入数据视图。
accessHandle.read(dataView, { at: 9 });
// 打印 `"More content"`。
console.log(textDecoder.decode(dataView));

// 在 4 字节后截断文件。
accessHandle.truncate(4);
```

> 请注意， `read()` and `write()` 的第一个参数是 [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或 `ArrayBufferView` 就像 [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)。 您不能直接操作一个 `ArrayBuffer` 的内容。 Instead, you create one of the [typed array objects](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) like an [`Int8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) or a `DataView` object which represents the buffer in a specific format, and use that to read and write the contents of the buffer.

## 将原始私有文件系统中的文件复制到用户可见的文件系统

如上所述，将文件从原始私有文件系统移动到用户可见文件系统是不可能的，但您可以复制文件。 既然 `showSaveFilePicker()` 只在主线程上曝光，但不在工人线程中，肯定要在那里运行代码。

```js
// 在主线程上，而不是在 Worker 中。 假设 `fileHandle` 是你在 Worker 线程中获取的 `FileSystemSyncAccessHandle` 的 `FileSystemFileHandle`。 请确保先关闭 Worker 线程中的文件。
const fileHandle = await opfsRoot.getFileHandle("fast");
try {
  // 获取用户可见文件系统中新文件的文件句柄，该文件与源私有文件系统中的文件名相同。
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

![Chrome Web Store 上的 OPFS Explorer Chrome DevTools 扩展。](/img/bVc9o6j)

安装扩展后，打开 Chrome DevTools, 选择 **OPFS Explorer** 标签，然后你准备检查文件级别。 点击文件名并通过点击回收站图标删除文件和文件夹，从原始私有文件系统保存文件到用户可见的文件系统。

## 演示

在一个 [演示](https://sqlite-wasm-opfs.glitch.me/) 中查看正在操作中的原始私有文件系统(如果您安装了OPFS Explorer扩展)，它将它用作编译到WebAssembly的 SQLite 数据库的后端。 请务必查看 Glitch</a> 的

源代码。 注意下面嵌入的版本如何不使用原始私有文件系统后端 (因为iframe 是交叉来源), 但当你在一个单独的标签页中打开演示时，它是这样的。</p> 



## 结论

由WHATWG指定的原始私有文件系统决定了我们如何使用和与网络上的文件交互。 它启用了使用用户可见文件系统无法实现的新案例。 所有主要浏览器供应商——苹果、Mozilla和Google——都已上班并共享一个联合视野。 开发原始私人文件系统在很大程度上是一项协作努力，开发者和用户的反馈对其进展至关重要。 在我们继续完善和改进这一标准的过程中， 欢迎您以问题或拉取请求的形式对 [whatwg/fs 存储库](https://github.com/whatwg/fs) 提供反馈。



## 相关链接

- [文件系统标准规范](https://fs.spec.whatwg.org/)
- [文件系统标准仓库](https://github.com/whatwg/fs)
- [WebKit 博文 The File System API with Origin Private File System](https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/)
- [OPFS Explorer 扩展](https://chrome.google.com/webstore/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd)



## 致谢

本文由 [Austin Sully](https://github.com/a-sully)、[Etienne Noël](https://ca.linkedin.com/in/enoel19) 和 [Rachel Andrew](https://rachelandrew.co.uk/) 审阅。 封面图来自 [Unsplash](https://unsplash.com/photos/XWDMmk-yW7Q) 上的 [Christina Rumpf](https://unsplash.com/@rumpf)。
