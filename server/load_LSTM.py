import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image

F = torch.nn.functional

class ConvLSTMCell(nn.Module):
    def __init__(self, input_channels, hidden_channels, kernel_size, bias=True):
        super(ConvLSTMCell, self).__init__()

        self.input_channels = input_channels
        self.hidden_channels = hidden_channels
        self.kernel_size = kernel_size

        self.conv_ii = nn.Conv2d(
            self.input_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )
        self.conv_hi = nn.Conv2d(
            self.hidden_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )

        self.conv_if = nn.Conv2d(
            self.input_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )
        self.conv_hf = nn.Conv2d(
            self.hidden_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )

        self.conv_ig = nn.Conv2d(
            self.input_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )
        self.conv_hg = nn.Conv2d(
            self.hidden_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )

        self.conv_io = nn.Conv2d(
            self.input_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )
        self.conv_ho = nn.Conv2d(
            self.hidden_channels,
            self.hidden_channels,
            self.kernel_size,
            padding=self.kernel_size // 2,
            bias=bias,
        )

    def forward(self, x, hidden_state):
        h_prev, c_prev = hidden_state

        i = torch.sigmoid(self.conv_ii(x) + self.conv_hi(h_prev))
        f = torch.sigmoid(self.conv_if(x) + self.conv_hf(h_prev))
        g = F.relu(self.conv_ig(x) + self.conv_hg(h_prev))
        o = torch.sigmoid(self.conv_io(x) + self.conv_ho(h_prev))
        c = f * c_prev + i * g
        h = o * F.relu(c)

        return h, c

class ConvLSTM(nn.Module):
    def __init__(self, input_channels, hidden_channels, kernel_size, bias=True):
        super(ConvLSTM, self).__init__()

        self.input_channels = input_channels
        self.hidden_channels = hidden_channels

        # Single ConvLSTM layer
        self.conv_lstm_cell = ConvLSTMCell(
            self.input_channels, self.hidden_channels, kernel_size, bias
        )

    def forward(self, x):
        batch_size, channels, sequence_length, height, width = x.size()

        # Initialize hidden state and cell state
        h = torch.zeros(batch_size, self.hidden_channels, height, width).to(x.device)
        c = torch.zeros(batch_size, self.hidden_channels, height, width).to(x.device)

        outputs = list()

        # Process each time step in the sequence
        for t in range(sequence_length):
            h, c = self.conv_lstm_cell(x[:, :, t, :, :], (h, c))
            outputs.append(h)

        outputs = torch.stack(outputs, dim=0).permute(1, 2, 0, 3, 4).contiguous()

        return outputs

class NextFramePredictionModel(nn.Module):
    def __init__(self):
        super().__init__()
        val = 256
        self.convlstm0 = nn.Sequential(
            ConvLSTM(3, val, 5),  # Modified line
            nn.BatchNorm3d(val),
        )
        self.convlstm1 = nn.Sequential(
            ConvLSTM(val, val, 3),
            nn.BatchNorm3d(val),
        )
        self.convlstm2 = nn.Sequential(
            ConvLSTM(val, val, 1),
            nn.BatchNorm3d(val),
        )
        self.final = ConvLSTM(val, 3, 1)

    def forward(self, x):
        x = self.convlstm0(x)
        x = self.convlstm1(x)
        x = self.convlstm2(x)

        return self.final(x)

class ModelWrapper(nn.Module):
    def __init__(self):
        super().__init__()
        self.arch = NextFramePredictionModel()


    def forward(self, x):
        return self.arch(x)