/**
 * 跳转工具函数
 * 所有跳转通过 window.open(url, '_blank') 在新页签打开
 * 外部页面文件已复制到 public/ 目录下，使用 ./moi_c_XXX/ 相对路径访问
 */

/**
 * 跳转到项目详情页
 * URL: ./moi_c_ProjectInfo/index.html#/project/{ProjectID}
 */
export function navigateToProjectDetail(projectId: string): void {
  const url = `./moi_c_ProjectInfo/index.html#/project/${projectId}`;
  window.open(url, '_blank');
}

/**
 * 跳转到项目列表页
 * URL: ./moi_c_ProjectInfo/index.html#/
 */
export function navigateToProjectList(keyword?: string): void {
  let url = './moi_c_ProjectInfo/index.html#/';
  if (keyword) {
    url += `?keyword=${encodeURIComponent(keyword)}`;
  }
  window.open(url, '_blank');
}

/**
 * 跳转到客户详情页
 * URL: ./moi_c_ClientInfo/index.html?id={ClientID}
 */
export function navigateToClientDetail(clientId: string): void {
  const url = `./moi_c_ClientInfo/index.html?id=${clientId}`;
  window.open(url, '_blank');
}

/**
 * 跳转到客户列表页
 * URL: ./moi_c_ClientInfo/list.html
 */
export function navigateToClientList(keyword?: string): void {
  let url = './moi_c_ClientInfo/list.html';
  if (keyword) {
    url += `?keyword=${encodeURIComponent(keyword)}`;
  }
  window.open(url, '_blank');
}
