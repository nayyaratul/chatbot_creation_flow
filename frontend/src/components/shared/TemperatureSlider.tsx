import { Slider, Typography, Space, Collapse } from 'antd';
import { AgentFormData } from '../../types/agent';

const { Text } = Typography;
const { Panel } = Collapse;

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  const getLabel = (temp: number) => {
    if (temp < 0.3) return 'Factual';
    if (temp < 0.7) return 'Balanced';
    return 'Creative';
  };

  const getExamples = (temp: number) => {
    if (temp < 0.3) {
      return {
        title: 'Factual Response',
        example: 'Based on the available information, the policy states that employees must submit attendance records by the 5th of each month.',
      };
    } else if (temp < 0.7) {
      return {
        title: 'Balanced Response',
        example: 'I can help you with that! According to the PMKVY 4.0 guidelines, attendance policies require daily check-ins. Let me provide you with the specific details.',
      };
    } else {
      return {
        title: 'Creative Response',
        example: 'Great question! I\'m excited to help you understand this. The attendance system is designed to be flexible while maintaining accountability. Here\'s what you need to know...',
      };
    }
  };

  const example = getExamples(value);

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text strong>Response Style</Text>
          <Text type="secondary">{getLabel(value)}</Text>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={value}
          onChange={onChange}
          marks={{
            0: 'Factual',
            0.5: 'Balanced',
            1: 'Creative',
          }}
        />
      </div>
      <Collapse size="small">
        <Panel header="View Example" key="1">
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              {example.title}:
            </Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              {example.example}
            </Text>
          </div>
        </Panel>
      </Collapse>
    </Space>
  );
}

export default TemperatureSlider;

