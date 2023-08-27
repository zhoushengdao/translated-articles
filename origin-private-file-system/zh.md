# 源私有文件系统

文件系统标准（File System Standard）引入了源私有文件系统（origin private file system，OPFS），作为页面源私有的、用户不可见的存储端点，它提供了对一种特殊文件（a special kind of file）的可选访问，并对性能进行了高度优化。

> **庆祝**  
> 源私有文件系统允许网络应用程序在自己特定的源虚拟文件系统中存储和操作文件，包括低级文件操作、逐字节访问和文件流。所有主要浏览器都支持源私有文件系统。

## 浏览器支持

源私有文件系统被现代浏览器支持，并由网络超文本应用程序技术工作组（[WHATWG](https://whatwg.org/)）标准化为 [File System Living Standard](https://fs.spec.whatwg.org/)。

![浏览器兼容性](https://jihulab.com/zhoushengdao/zhoushengdao-articles/-/raw/main/origin-private-file-system/bcd.svg?ref_type=heads)

## 动机

提到计算机上的文件，你可能会想到这样的文件层次结构：文件被组织在文件夹中——你可以用操作系统的文件资源管理器来查看。例如，在 Windows 上，对于一个名为 Tom 的用户，他的待办事项列表可能位于 `C:\Users\Tom\Documents\ToDo.txt`。在这个示例中，`ToDo.txt` 是文件名，`Users`、`Tom` 和 `Documents` 是文件夹名。Windows 上的 `C:\` 表示驱动器的根目录。

> 在本文中，我交替使用*文件夹*和*目录*这两个术语，而忽略了文件系统概念（目录）和图形用户界面[隐喻](https://en.wikipedia.org/wiki/Directory_%28computing%29#Folder_metaphor)（文件夹）之间的区别。

### 在 Web 上处理文件的传统方式

若要在网络应用程序中编辑待办事项列表，这是传统的流程：

1. 用户将文件*上传*到服务器，或在客户端使用 [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file) *打开*文件。
1. 用户进行编辑，然后通过 JavaScript 以编程方式对注入的 [`<a download="ToDo.txt">`](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/download) 执行 [`click()`](https://developer.mozilla.org/docs/Web/API/HTMLElement/click) 方法来*下载*生成的文件。
1. 要打开文件夹，可以使用 [`<input type="file" webkitdirectory>`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory)，尽管该属性的名称具有私有前缀，但实际上得到了浏览器的普遍支持。

### 在 Web 上处理文件的现代方式

这种流程并不代表用户编辑文件的思维方式，这意味着用户最终只能下载其输入文件的*副本*。因此，文件系统访问 API（File System Access API）引入了三个选择器方法——[`showOpenFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showOpenFilePicker)、[`showSaveFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showSaveFilePicker) 和 [`showDirectoryPicker()`](https://developer.mozilla.org/docs/Web/API/Window/showDirectoryPicker)，它们的功能和名称一样（译注：它们的功能依次为打开文件、保存文件和打开目录）。通过它们，可以以如下的流程来处理文件：

1. 使用 `showOpenFilePicker()` 打开 `ToDo.txt`，得到一个 [`FileSystemFileHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle) 对象。
1. 通过调用文件句柄 `FileSystemFileHandle` 对象的 [`getFile()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/getFile) 方法获取 [`File`](https://developer.mozilla.org/docs/Web/API/File)。
1. 编辑文件，然后在句柄上调用 [`requestPermission({ mode: 'readwrite' })`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/requestPermission)。
1. 如果用户接受权限请求，则将更改保存回原始文件。
1. 或者，调用 `showSaveFilePicker()` 让用户选择一个新文件。 （如果用户选择的是之前打开的文件，其内容将被覆盖。）对于重复保存，可以保留文件句柄，这样就不必再次显示文件保存对话框。

### 在 Web 上处理文件的限制

通过这些方法访问的文件和文件夹位于*用户可见*的文件系统中。从网络上保存的文件，特别是可执行文件，都会被打上[网络标记](https://textslashplain.com/2016/04/04/downloads-and-the-mark-of-the-web/)，因此在潜在危险文件被执行之前，操作系统会显示额外的警告。作为一项额外的安全功能，从网络上获取的文件也会受到[安全浏览](https://safebrowsing.google.com/)的保护，为简单起见，在本文中，你可以将其视为基于云的病毒扫描。当使用文件系统访问 API 向文件写入数据时，写入不是就地写入，而是会使用临时文件。除非通过所有这些安全检查，否则文件本身不会被修改。可以想象，即使[在 macOS](https://bugs.chromium.org/p/chromium/issues/detail?id=1413443) 等系统上尽可能地进行了优化，但这些检查还是让文件操作变得相对缓慢。尽管如此，每个 [`write()`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/write) 调用都是独立的，因此它在后台会打开文件，查找到给定的偏移量，并最终写入数据。

### 作为处理工作基础的文件

同时，文件也是记录数据的绝佳方式。例如，[SQLite](https://www.sqlite.org/) 将整个数据库存储在一个文件中。另一个例子是用于图像处理的 [mipmaps](https://en.wikipedia.org/wiki/Mipmap)。Mipmaps 是经过预先计算和优化的图像序列，每一幅图像都是前一幅图像的分辨率逐渐降低的表示，这使得许多操作（如缩放）变得更快。那么，网络应用程序如何既能获得文件的优势，又能避免传统网络文件处理的性能成本呢？答案是*源私有文件系统*。

## 用户可见性与源私有文件系统

不同于通过操作系统的文件资源管理器浏览的、你可以读取、写入、移动和重命名文件和文件夹的用户可见文件系统，源私有文件系统不会被用户看到。顾名思义，源私有文件系统中的文件和文件夹是私有的，更具体地说，是网站的[源](https://developer.mozilla.org/docs/Glossary/Origin)的私有文件系统。在 DevTools 控制台中输入 [`location.origin`](https://developer.mozilla.org/docs/Web/API/Location/origin) 来查找页面的源。例如，页面 `https://developer.chrome.com/articles/` 的源是 `https://developer.chrome.com`（即 `/articles` *不*是源的一部分）。你可以在[理解“同站”和“同源”](https://web.dev/same-site-same-origin/#origin)一文中阅读更多关于源理论的内容。共享相同源的所有页面都可以在源私有文件系统中看到相同的数据，因此 `https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/` 可以看到与上例相同的信息。每个源都有自己独立的源私有文件系统，这意味着 `https://developer.chrome.com` 的源私有文件系统与 [`https://web.dev`](https://web.dev/) 的源私有文件系统完全不同。在 Windows 系统中，用户可见文件系统的根目录是 `C:\`。而源私有文件系统的相似项是通过调用异步方法 [`navigator.storage.getDirectory()`](https://developer.mozilla.org/docs/Web/API/StorageManager/getDirectory) 得到的每个源的初始的空的根目录。关于用户可见文件系统与源私有文件系统的比较，请见下图。从图中可以看出，除了根目录外，其他所有东西在概念上都是一样的，都具有文件和文件夹的层次结构，可以根据数据和存储需要进行组织和排列。

![用户可见文件系统和源私有文件系统的示意图，以及两个示例文件层次结构。用户可见文件系统的入口点是一个符号硬盘，源私有文件系统的入口点是调用“navigator.storage.getDirectory”方法。](/img/bVc9o5U)

## 源私有文件系统的特点

与浏览器中的其他存储机制（如 [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) 或 [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Using_IndexedDB)）一样，源私有文件系统也受浏览器配额的限制。当用户[清除所有浏览数据](https://support.google.com/chrome/answer/2392709)或[所有网站数据](https://developer.chrome.com/docs/devtools/storage/cache/#deletecache)时，源私有文件系统也将被删除。要了解应用程序已经消耗了多少存储空间，请调用 [`navigator.storage.estimate()`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate)，然后在返回的对象中查看 [`usage`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate#usage) 条目。如果你想要特别查看 `fileSystem` 条目的信息，请看 [`usageDetails`](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate#usagedetails) 对象，它是按存储方式细分的。由于源私有文件系统对用户不可见，因此没有权限提示，也没有安全浏览检查。

## 访问根目录

要访问根目录，请运行下面的命令。你最后会得到一个空目录句柄，更确切地说，是一个 [`FileSystemDirectoryHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle)。

```js
const opfsRoot = await navigator.storage.getDirectory();
// 类型为 "directory"、名称为 "" 的 FileSystemDirectoryHandle。
console.log(opfsRoot);
```

## 主线程或 Web Worker

有两种方法使用源私有文件系统：在[主线程](https://developer.mozilla.org/docs/Glossary/Main_thread)上或在 [Web Worker](https://developer.mozilla.org/docs/Web/API/Worker) 中。Web Worker 不会阻塞主线程，这意味着在这里，API 可以是同步的，而在主线程上通常不会允许这种模式。同步 API 可以更快，因为它们可以避免处理 promise，且在 C 语言等可以编译成 WebAssembly 的语言中，文件操作通常是同步的。

```c
// 这是同步的 C 代码。
FILE *f;
f = fopen("example.txt", "w+");
fputs("Some text\n", f);
fclose(f);
```

如果你需要最快的文件操作和/或需要使用 [WebAssembly](https://developer.mozilla.org/docs/WebAssembly)，请跳至[在 Web Worker 中使用源私有文件系统](#在-web-worker-中使用源私有文件系统)。否则，你可以继续阅读。

## 在主线程上使用源私有文件系统

### 创建新文件和文件夹

有了根目录句柄后，分别使用 [`getFileHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle) 和 [`getDirectoryHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getDirectoryHandle) 方法创建文件和文件夹。通过传递 [`{ create: true }`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle#create)，如果文件或文件夹不存在，它将被创建。通过在新建的目录上调用这些函数来建立文件层次结构。

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

![从前面的代码示例中得到的文件层次结构。](/img/bVc9o5E)

### 访问现有文件和文件夹

如果你知道文件和文件夹的名称，就可以通过调用 `getFileHandle()` 或 `getDirectoryHandle()` 方法，并传入文件或文件夹的名称来访问以前创建的文件和文件夹。

```js
const existingFileHandle = await opfsRoot.getFileHandle("my first file");
const existingDirectoryHandle =
  await opfsRoot.getDirectoryHandle("my first folder");
```

### 读取与文件句柄相关联的文件

`FileSystemFileHandle` 表示文件系统中的一个文件。要获取关联的 `File` 对象，请使用 [`getFile()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/getFile) 方法。 `File` 对象是 [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) 的一种特殊类型，可以在任何能使用 `Blob` 的上下文中使用。尤其是 [`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader)、[`URL.createObjectURL()`](https://developer.mozilla.org/docs/Web/API/URL/createObjectURL)、[`createImageBitmap()`](https://developer.mozilla.org/docs/Web/API/createImageBitmap) 和 [`XMLHttpRequest.send()`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/send)，它们都能处理 `Blob` 和 `File`。如果你愿意，从 `FileSystemFileHandle` 获取 `File` 来“释放”数据，这样你就可以访问它，并将其提供给用户可见文件系统。

```js
const file = await fileHandle.getFile();
console.log(await file.text());
```

### 通过流写入文件

为了将数据流写入文件，你需要通过调用 [`createWritable()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createWritable) 创建一个 [`FileSystemWritableFileStream`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream)，然后使用 [`write()`](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/write) 将内容写入文件。最后，需要用 [`close()`](https://developer.mozilla.org/docs/Web/API/WritableStream/close) 来关闭流。

```js
const contents = "Some text";
// 获取一个可写流。
const writable = await fileHandle.createWritable();
// 将文件内容写入数据流。
await writable.write(contents);
// 关闭数据流，保存内容。
await writable.close();
```

### 删除文件和文件夹

通过调用特定文件或目录句柄上的 [`remove()`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/remove) 方法来删除文件和文件夹。要删除包括所有子文件夹在内的文件夹，请使用 [`{recursive: true}`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/remove#recursive) 选项。

```js
await fileHandle.remove();
await directoryHandle.remove({ recursive: true });
```

> `remove()` 方法目前只在 Chrome 浏览器中实现。你可以通过 `'remove' in FileSystemFileHandle.prototype` 来检测浏览器是否支持该功能。

作为替代，如果知道目录中要删除的文件或文件夹的名称，可以使用 [`removeEntry()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/removeEntry) 方法。

```js
directoryHandle.removeEntry("my first nested file");
```

> 作为快速提示，`await (await navigator.storage.getDirectory()).remove({ recursive: true })` 是清除整个源私有文件系统的最快方法。

### 移动和重命名文件和文件夹

使用 [`move()`](https://github.com/whatwg/fs/pull/10) 方法重命名或移动文件和文件夹。移动和重命名可以同时进行，也可以单独进行。

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

> 重命名和移动文件夹在 Chrome 浏览器中尚未实现。你也不能将文件从源私有文件系统移动到用户可见文件系统。不过你可以[复制](#从源私有文件系统向用户可见文件系统复制文件)它们。

### 解析文件或文件夹的路径

要了解给定文件或文件夹相对于参照目录（reference directory）的位置，请使用 [`resolve()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/resolve) 方法，并将 `FileSystemHandle` 作为参数传递给该方法。要获取源私有文件系统中文件或文件夹的完整路径，请将通过 `navigator.storage.getDirectory()` 获得的根目录作为参照目录。

```js
const relativePath = await opfsRoot.resolve(nestedDirectoryHandle);
// `relativePath` 为 `['my first folder', 'my first nested folder']`。
```

### 检查两个文件或文件夹句柄是否指向同一个文件或文件夹

有时，你有两个句柄，却不知道它们是否指向同一个文件或文件夹。对于这种情况，可以使用 [`isSameEntry()`](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/isSameEntry) 方法。

```js
fileHandle.isSameEntry(nestedFileHandle);
// 返回 `false`。
```

## 列出文件夹的内容

`FileSystemDirectoryHandle` 是一个[异步迭代器](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)，可通过 [`for await…of`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for-await...of) 循环遍历。作为异步迭代器，它还支持 [`entries()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/entries)、[`values()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/values) 和 [`keys()`](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/keys) 方法，你可以根据自己需要的信息从中进行选择：

<!-- prettier-ignore-start -->
```js
for await (let [name, handle] of directoryHandle) {}
for await (let [name, handle] of directoryHandle.entries()) {}
for await (let handle of directoryHandle.values()) {}
for await (let name of directoryHandle.keys()) {}
```
<!-- prettier-ignore-end -->

## 递归列出文件夹和所有子文件夹的内容

处理与递归搭配的异步循环和函数很容易出错。下面的函数可以作为一个起点，用于列出文件夹及其所有子文件夹的内容，包括所有文件及其大小。如果你不需要文件大小，可以简化函数，在 `directoryEntryPromises.push` 处不推送 promise `handle.getFile()`，而是直接推送 `handle`。

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

如前所述，Web Worker 不能阻塞主线程，因此在这种情况下允许使用同步方法。

### 获取同步访问句柄

最快的文件操作入口点是 [`FileSystemSyncAccessHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle)，可以通过在一个常规的 [`FileSystemFileHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle) 上调用 [`createSyncAccessHandle()`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle) 获取。

```js
const fileHandle = await opfsRoot.getFileHandle("my highspeed file.txt", {
  create: true,
});
const syncAccessHandle = await fileHandle.createSyncAccessHandle();
```

> 这可能会令人困惑，但实际上，你可以从常规的 `FileSystemFileHandle` 上获得*同步的* `FileSystemSyncAccessHandle`。还要注意的是，尽管方法 `createSyncAccessHandle()` 的名称中包含 `Sync`，但该方法是*异步的*。

### 同步就地文件方法

一旦拥有了同步访问句柄，你就可以访问所有快速地同步就地文件方法。

- [`getSize()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/getSize)：以字节为单位返回文件大小。
- [`write()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/write)：将缓冲区的内容写入文件，可选择写入到指定偏移量，并返回写入的字节数。通过检查返回的字节数，调用者可以检测并处理错误和部分写入。
- [`read()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/read)：将文件内容读入缓冲区，可选择从指定偏移量读起。
- [`truncate()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/truncate)：将文件调整为给定大小。
- [`flush()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/flush)：确保文件内容包含通过 `write()` 所做的所有修改。
- [`close()`](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/close)：关闭访问句柄。

下面是一个使用上述所有方法的示例。

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

// 准备与文件具有相同长度的 DataView。
const dataView = new DataView(new ArrayBuffer(size));

// 将整个文件读入 DataView。
accessHandle.read(dataView);
// 打印 `"Some textMore content"`。
console.log(textDecoder.decode(dataView));

// 从偏移量 9 开始读入 DataView。
accessHandle.read(dataView, { at: 9 });
// 打印 `"More content"`。
console.log(textDecoder.decode(dataView));

// 在 4 字节后截断文件。
accessHandle.truncate(4);
```

> 请注意，`read()` 和 `write()` 的第一个参数是 [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或 `ArrayBufferView`（如 [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)）。你不能直接操作 `ArrayBuffer` 中的内容。相反，你需要创建一个以特定格式表示缓冲区的[类型化数组对象](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)（如 [`Int8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) 或 `DataView` 对象），然后使用它来读写缓冲区中的内容。

## 从源私有文件系统向用户可见文件系统复制文件

如前所述，无法将文件从源私有文件系统移动到用户可见文件系统，但可以复制文件。因为 `showSaveFilePicker()` 只在主线程中暴露，而不存在于 Worker 线程中，所以请确保在主线程中运行下面的代码。

```js
// 在主线程上，而不是在 Worker 中。
// 假设 `fileHandle` 是你在 Worker 线程中用于获取的 `FileSystemSyncAccessHandle` 的 `FileSystemFileHandle`。
// 请确保先关闭 Worker 线程中的文件。
const fileHandle = await opfsRoot.getFileHandle("fast");
try {
  // 获取用户可见文件系统中新文件的句柄，该文件与源私有文件系统中的文件名相同。
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

## 调试源私有文件系统

在内置的 DevTools 支持（参见 [crbug/1284595](https://crbug.com/1284595)）被添加之前，请使用 [OPFS Explorer](https://chrome.google.com/webstore/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd) Chrome 浏览器扩展调试源私有文件系统。上面[创建新文件和文件夹](#创建新文件和文件夹)部分的截图就是直接从扩展中截取的。

![Chrome Web Store 上的 OPFS Explorer Chrome DevTools 扩展。](/img/bVc9o6j)

安装扩展后，打开 Chrome 浏览器的 DevTools，选择 **OPFS Explorer** 选项卡，然后你就可以检查文件层次结构了。点击文件名可将文件从源私有文件系统保存到用户可见文件系统，点击垃圾桶图标可删除文件或文件夹。

## 演示

在将源私有文件系统用作编译为 WebAssembly 的 SQLite 数据库后端的[演示](https://sqlite-wasm-opfs.glitch.me/)中，你可以看到源私有文件系统的运行情况（如果你安装了 OPFS Explorer 扩展）。请务必查看 [Glitch 上的源代码](https://glitch.com/edit/#!/sqlite-wasm-opfs)。请注意，下面的嵌入式版本并不使用源私有文件系统后端（因为 iframe 是跨源的），但当你在单独的标签页中打开演示时，它就会使用。

## 结论

由 WHATWG 制定的源私有文件系统塑造了我们在网络上使用文件和与文件交互的方式。它实现了用户可见文件系统无法实现的新用例。所有主要的浏览器供应商——苹果、Mozilla 和谷歌——都参与其中，并拥有共同的愿景。源私有文件系统的开发在很大程度上是一项协作工作，开发人员和用户的反馈对其进展至关重要。在我们不断完善和改进该标准的过程中，欢迎以议题或拉取请求的方式向 [whatwg/fs 存储库](https://github.com/whatwg/fs)提供反馈。

## 相关链接

- [文件系统标准规范](https://fs.spec.whatwg.org/)
- [文件系统标准仓库](https://github.com/whatwg/fs)
- [WebKit 博文 The File System API with Origin Private File System](https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/)
- [OPFS Explorer 扩展](https://chrome.google.com/webstore/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd)

## 致谢

本文由 [Austin Sully](https://github.com/a-sully)、[Etienne Noël](https://ca.linkedin.com/in/enoel19) 和 [Rachel Andrew](https://rachelandrew.co.uk/) 审阅。封面图来自 [Unsplash](https://unsplash.com/photos/XWDMmk-yW7Q) 上的 [Christina Rumpf](https://unsplash.com/@rumpf)。
