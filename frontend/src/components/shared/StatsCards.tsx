import { Card } from 'antd';
import { CheckCircleOutlined, MessageOutlined, TrophyOutlined } from '@ant-design/icons';

interface StatsCardsProps {
  activeCount?: number;
  messages24h?: number;
  resolutionRate?: number;
}

function StatsCards({ activeCount = 4, messages24h = 20, resolutionRate = 75 }: StatsCardsProps) {
  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
      <Card
        style={{
          flex: 1,
          borderRadius: '8px',
          padding: '16px',
          background: '#FFFFFF',
          border: 'none',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '22px',
                color: '#000000',
                marginBottom: '8px',
              }}
            >
              Active
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: '28px',
                color: '#249D57',
              }}
            >
              {activeCount}
            </div>
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#F6FFED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleOutlined style={{ fontSize: '20px', color: '#249D57' }} />
          </div>
        </div>
      </Card>
      <Card
        style={{
          flex: 1,
          borderRadius: '8px',
          padding: '16px',
          background: '#FFFFFF',
          border: 'none',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '22px',
                color: '#000000',
                marginBottom: '8px',
              }}
            >
              Messages (24h)
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: '28px',
                color: '#13C2C2',
              }}
            >
              {messages24h}
            </div>
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#E6FFFB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageOutlined style={{ fontSize: '20px', color: '#13C2C2' }} />
          </div>
        </div>
      </Card>
      <Card
        style={{
          flex: 1,
          borderRadius: '8px',
          padding: '16px',
          background: '#FFFFFF',
          border: 'none',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '22px',
                color: '#000000',
                marginBottom: '8px',
              }}
            >
              Resolution Rate
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: '28px',
                color: '#FAAD14',
              }}
            >
              {resolutionRate}%
            </div>
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#FFFBE6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrophyOutlined style={{ fontSize: '20px', color: '#FAAD14' }} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StatsCards;

