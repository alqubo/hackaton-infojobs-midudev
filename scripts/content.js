import {colors, getInitialMessage, loader} from "./const.js";
import {
  Configuration,
  ChatCompletionRequestMessageRoleEnum,
  OpenAIApi
} from 'openai'

const createLoader = () => {
  const $container = document.createElement('div')
  $container.className = "panel-canvas panel-rounded"
  $container.id = 'row-loader'
  $container.style.marginBottom = '8px'
  $container.style.backgroundColor = '#fafafa'
  $container.style.border = `dashed #e5e5e5 2px`
  $container.style.borderRadius = '6px'

  $container.innerHTML = `
            <div class="inner">
                <div class="content-middle">
                    <div class="content-type-media">${loader}</div>
                    <div class="content-type-text">
                        <p>Calculando tu afinidad...</p>
                    </div>
                </div>
            </div>
        `
  return $container
}

const createRow = (score, message) => {
  const mode = score > 6
    ? 0
    : score > 4
      ? 1
      : 2

  const {backgroundColor, borderColor, icon} = colors[mode]

  const $container = document.createElement('div')
  $container.className = "panel-canvas panel-rounded"
  $container.style.marginBottom = '8px'
  $container.style.backgroundColor = backgroundColor
  $container.style.border = `dashed ${borderColor} 2px`
  $container.style.borderRadius = '6px'

  $container.innerHTML = `
            <div class="inner">
                <div class="content-middle">
                    <div class="content-type-media">${icon}</div>
                    <div class="content-type-text">
                        <p>${message}</p>
                    </div>
                </div>
            </div>
        `
  return $container
}

const getScore = async (user, info) => {
  const configuration = new Configuration({ apiKey: user.apikey })
  const openai = new OpenAIApi(configuration)

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: getInitialMessage(user)
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: info
      }
    ]
  })

  try {
    const data = completion.data.choices[0].message?.content ?? ''
    return JSON.parse(data)
  } catch (e) {
    console.log('e', e)
    throw new Error('Error parsing response')
  }
}

const isEmpty = (obj) => {
  return obj
    ? Object.values(obj).some(x => (x === null || x === ''))
    : true
}

const USER_DATA_KEY = 'user_data'
const main = async () => {
  const id = window.location.pathname.split('of-')[1]
  const user = (await chrome.storage.sync.get(USER_DATA_KEY))[USER_DATA_KEY];


  if (id) {
    const $element = document.querySelector('#main-wrapper > div > div.container.container-slotbanner > div:nth-child(3)')
    if(!$element) return;

    const $loader = createLoader();
    $element.prepend($loader)

    const $info = document.querySelector('#main-wrapper > div > div.container.container-slotbanner > div:nth-child(3) > div.container-expanded.panel-default > div > div.col-8.col-12-medium > div > div.inner.inner-expanded.panel-canvas.panel-rounded')
    if($info) {
      const info = $info.innerText

      const isUserEmpty = isEmpty(user)
      if(isUserEmpty) {
        const $row = createRow(5, 'Configura tu perfil para poder calcular tu afinidad con esta oferta.<br>Haz click en el icono de la extensión y rellena los campos.')
        $loader.remove()
        $element.prepend($row)
        return;
      }

      if(info) {
        getScore(user, info)
          .then(({score, message}) => {
            const $row = createRow(score, message)
            $element.prepend($row)
          }).catch((e) => {
            const message = e.response.data.error.code === 'invalid_api_key'
              ? 'Introduce una API Key correcta :('
              : 'No se ha podido calcular tu afinidad con esta oferta :('
            const $row = createRow(0, message)
            $element.prepend($row)
          }).finally(() => {
            $loader.remove()
          })
      }
    }
  }
}

main()
