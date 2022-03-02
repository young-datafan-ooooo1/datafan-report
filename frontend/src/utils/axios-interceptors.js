import Cookie from 'js-cookie'
import copy from 'copy-text-to-clipboard'

// 401拦截

// function  modifyNotification(){
//   let dom = document.querySelector(
//     'body > div.ant-notification.ant-notification-topRight > span'
//   )
//   if (dom) {
//     for (let i = 0; i < dom.childNodes.length; i += 1) {
//       dom.childNodes[i].classList.add('hover:shadow-2xl')
//     }
//   }
// }

function notify(msg, title) {
  return {
    message: title ?? '状态异常',
    description: h => {
      return h(
        'span',
        {
          style: {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflowWrap: 'break-word',
            width: '18rem',
            display: 'inline-block'
          }
        },
        msg
      )
    },
    duration: null,
    btn: h => {
      return h(
        'a-button',
        {
          props: {
            type: 'link',
            size: 'small'
          },
          on: {
            click: event => {
              const text =
                event.toElement?.parentNode.previousSibling.innerText ??
                event.target?.parentNode.previousSibling.innerText
              copy('状态异常 ' + text)
            }
          }
        },
        '拷贝详细信息'
      )
    }
  }
}

const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const { notification } = options
    if (response?.status === 401) {
      notification.warning(notify('无此权限'))
    }

    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { notification } = options

    let errorData = error
    if (error?.response?.status === 401) {
      let errorCode = errorData?.response?.data?.error
      switch (errorCode) {
        case 'Forbidden"':
          notification.error({ message: '无此权限' })
          break
        case 'unauthorized':
          notification.error({
            message: errorData?.response?.data?.error_description ?? '无此权限'
          })
          break
      }
      // notification.error({message: '无此权限'})
    } else if (error?.response?.status === 400) {
      let errorCode = errorData?.response?.data?.error
      if (errorCode === 'invalid_grant') {
        notification.error({
          message: errorData?.response?.data?.error_description
        })
      }
    } else {
      notification.warn(
        notify(
          `config:${JSON.stringify(error.config)} \n response:${JSON.stringify(
            error.response
          )}`,
          '网络异常'
        )
      )
    }

    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const { notification } = options
    if (
      response?.status >= 200 &&
      response?.status < 300 &&
      (response?.data.code === '10010' ||
        response?.data.code === '10001' ||
        response?.data.code === '10002' ||
        response?.data.code === '10003' ||
        response?.data.code === '10005')
    ) {
      notification.warning(notify(response.data.msg))
    } else if (response.data.code === '10004') {
      notification.warning(
        notify(JSON.stringify(response.data.attachment ?? response.data.msg))
      )
    }

    switch (response?.status) {
      case 400: {
        if (
          response.data.error === 'invalid_token' ||
          response.data.error === 'invalid_request'
        ) {
          notification.error(notify(response.data.error_description))
        } else {
          notification.error(notify(response.statusText))
        }

        break
      }
      case 401:
        notification.error(notify(response.data.error_description))

        // axios.interceptors.response.eject(ss);
        break
      case 403:
        notification.error({ message: '登录失效，请重新登录' })

        break
      case 500:
        notification.error(notify(response.statusText))

        break
      case 502:
        notification.error(notify(response.statusText))

        break
    }

    const addr = new URL(response?.config?.url)
    if (
      response?.status >= 200 &&
      response?.status < 300 &&
      (response?.data?.code === '10000' || (addr.pathname.indexOf('/rbac-user-server') >= 0)))
    {
      return response
    } else {
      return Promise.reject(response)
    }
  },
  onRejected(error, options) {
    const { notification } = options
    const { response } = error
    if (response?.status === 403) {
      notification.warn(
        notify(
          `config:${JSON.stringify(error.config)} \n response:${JSON.stringify(
            error.response
          )}`,
          '请求被拒绝'
        )
      )
    }

    return Promise.reject(error)
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const { notification } = options
    const { url, xsrfCookieName } = config
    if (
      window.location.href.indexOf('login') === -1 &&
      url.indexOf('login') === -1 &&
      xsrfCookieName &&
      !Cookie.get(xsrfCookieName)
    ) {
      notification.warning({ message: '认证 token 已过期，请重新登录' })
    }

    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { notification } = options
    notification.warn(
      notify(
        `config:${JSON.stringify(error.config)} \n response:${JSON.stringify(
          error.response
        )}`,
        '请求异常'
      )
    )

    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403] // 响应拦截
}
