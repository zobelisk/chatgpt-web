import xiaotongConfig from '../xiaotong.json';
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

function generateSystemMessage(): string {
    // 基本信息
    const systemMessageBase = `你是${xiaotongConfig.Metadata.Name}，一个由${xiaotongConfig.Metadata.Author}创建的学习助手。版本为${xiaotongConfig.Metadata.Version}。`;

    // ... [其他您已有的生成提示词的代码]

    // 将所有提示词整合到一起
    const combinedMessage = [
        systemMessageBase,
        systemMessagePersonalization,
        personalizationMessage,
        systemMessageCommands,
        systemMessageFunctionRules,
        systemMessageFunctions,
        systemInitMessage
    ].join('\n\n'); // 使用两个换行符将它们分隔开

    return combinedMessage;
}

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

if (authStore.isChatGPTAPI) {
    // 基本信息
    const systemMessageBase = `你是${xiaotongConfig.Metadata.Name}，一个由${xiaotongConfig.Metadata.Author}创建的学习助手。版本为${xiaotongConfig.Metadata.Version}。`;

    // 个性化选项信息
    const depthOptions = xiaotongConfig.PersonalizationOptions.Depth.join(', ');
    const learningStyleOptions = xiaotongConfig.PersonalizationOptions.LearningStyle.join(', ');
    const communicationStyleOptions = xiaotongConfig.PersonalizationOptions.CommunicationStyle.join(', ');
    const toneStyleOptions = xiaotongConfig.PersonalizationOptions.ToneStyle.join(', ');
    const reasoningFrameworkOptions = xiaotongConfig.PersonalizationOptions.ReasoningFramework.join(', ');

    const systemMessagePersonalization = `你可以根据以下选项进行个性化设置：
    - 学习深度: ${depthOptions}
    - 学习风格: ${learningStyleOptions}
    - 交流方式: ${communicationStyleOptions}
    - 语气风格: ${toneStyleOptions}
    - 推理框架: ${reasoningFrameworkOptions}
    `;

    // 学生配置信息
    const studentDepth = xiaotongConfig.StudentConfiguration.Depth;
    const studentLearningStyle = xiaotongConfig.StudentConfiguration["Learning-Style"];
    const studentCommunicationStyle = xiaotongConfig.StudentConfiguration["Communication-Style"];
    const studentToneStyle = xiaotongConfig.StudentConfiguration["Tone-Style"];
    const studentReasoningFramework = xiaotongConfig.StudentConfiguration["Reasoning-Framework"];
    const studentEmojis = xiaotongConfig.StudentConfiguration.Emojis;
    const studentLanguage = xiaotongConfig.StudentConfiguration.Language;

    const personalizationMessage = `你当前的学生配置为：
    - 学习深度: ${studentDepth}
    - 学习风格: ${studentLearningStyle}
    - 交流方式: ${studentCommunicationStyle}
    - 语气风格: ${studentToneStyle}
    - 推理框架: ${studentReasoningFramework}
    - 表情符号: ${studentEmojis}
    - 语言: ${studentLanguage}
    `;

    // 命令信息
    const commandPrefix = xiaotongConfig.Commands.Prefix;
    const commandList = xiaotongConfig.Commands.List;
    let commandDescriptions = '';

    for (const command in commandList) {
        const action = commandList[command].action;
        const format = commandList[command].format || '';
        const description = commandList[command].description || '';
        commandDescriptions += `- ${commandPrefix}${command} (${action}): ${description} 格式: ${format}\n`;
    }

    const systemMessageCommands = `你可以使用以下命令来与我互动：
    ${commandDescriptions}
    `;

    // 功能规则信息
    const functionRules = xiaotongConfig.FunctionRules;
    let functionRulesDescriptions = '';

    for (const rule in functionRules) {
        functionRulesDescriptions += `- ${rule}: ${functionRules[rule]}\n`;
    }

    const systemMessageFunctionRules = `请遵循以下功能规则：
    ${functionRulesDescriptions}
    `;

    // 功能信息
    const functions = xiaotongConfig.Functions;
    let functionDescriptions = '';

    for (const func in functions) {
        const funcDetails = functions[func];
        let args = funcDetails.Args ? `参数: ${funcDetails.Args}` : '';
        functionDescriptions += `功能名: ${func}\n${args}\n描述: ${funcDetails.Description}\n\n`;
    }

    const systemMessageFunctions = `以下是您可以使用的功能：
    ${functionDescriptions}
    `;

    // 初始化信息
    const initConfig = xiaotongConfig.Init;
    const magicNumber = initConfig['magic-number'];
    const initMessages = initConfig.messages;
    let initOutput = '初始化消息如下：\n';

    for (const message of initMessages) {
        initOutput += `- ${message}\n`;
    }

    const systemInitMessage = `魔法数字: ${magicNumber}\n${initOutput}`;

    // 执行信息
    const executeConfig = xiaotongConfig.Execute;

    function executeFunction() {
        if (executeConfig === "Init") {
            console.log(systemInitMessage);
        } else {
            console.log(`执行功能：${executeConfig}`);
        }
    }

    executeFunction();

const systemMessage = [
    systemMessageBase,
    systemMessagePersonalization,
    personalizationMessage,
    systemMessageCommands,
    systemMessageFunctionRules,
    systemMessageFunctions,
    systemInitMessage
].join('\n\n'); // 使用两个换行符将它们分隔开


    data = {
      ...data,
      systemMessage: systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
}



  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
