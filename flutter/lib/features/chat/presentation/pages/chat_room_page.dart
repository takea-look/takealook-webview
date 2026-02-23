import 'package:flutter/material.dart';

import '../../../../core/theme/tds_theme.dart';

class ChatRoomPage extends StatefulWidget {
  const ChatRoomPage({super.key, required this.roomId});

  final String roomId;

  static const routePrefix = '/chat/';

  @override
  State<ChatRoomPage> createState() => _ChatRoomPageState();
}

class _ChatRoomPageState extends State<ChatRoomPage> {
  final _messages = <_ChatMessage>[
    const _ChatMessage(
      id: 'm1',
      text: '안녕하세요 👋',
      mine: false,
      type: _MessageType.text,
      status: _SendStatus.sent,
    ),
    const _ChatMessage(
      id: 'm2',
      text: 'Flutter Native 채팅 화면 테스트 중이에요.',
      mine: true,
      type: _MessageType.text,
      status: _SendStatus.sent,
    ),
    const _ChatMessage(
      id: 'm3',
      text: 'https://takealook.my/help',
      mine: false,
      type: _MessageType.link,
      status: _SendStatus.sent,
    ),
    const _ChatMessage(
      id: 'm4',
      text: '[image] profile_sample.jpg',
      mine: false,
      type: _MessageType.image,
      status: _SendStatus.sent,
    ),
  ];

  final _controller = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
  }

  void _scrollToBottom() {
    if (!_scrollController.hasClients) return;
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: const Duration(milliseconds: 180),
      curve: Curves.easeOut,
    );
  }

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    _controller.clear();

    final pending = _ChatMessage(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      text: text,
      mine: true,
      type: text.startsWith('http') ? _MessageType.link : _MessageType.text,
      status: _SendStatus.sending,
    );

    setState(() {
      _messages.add(pending);
    });
    _scrollToBottom();

    await Future<void>.delayed(const Duration(milliseconds: 280));

    if (!mounted) return;

    final shouldFail = text.toLowerCase().contains('fail');
    setState(() {
      final idx = _messages.indexWhere((m) => m.id == pending.id);
      if (idx == -1) return;
      _messages[idx] = _messages[idx].copyWith(
        status: shouldFail ? _SendStatus.failed : _SendStatus.sent,
      );
    });
    _scrollToBottom();
  }

  Future<void> _retryMessage(String id) async {
    final idx = _messages.indexWhere((m) => m.id == id);
    if (idx == -1) return;

    setState(() {
      _messages[idx] = _messages[idx].copyWith(status: _SendStatus.sending);
    });

    await Future<void>.delayed(const Duration(milliseconds: 220));
    if (!mounted) return;

    setState(() {
      _messages[idx] = _messages[idx].copyWith(status: _SendStatus.sent);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text('채팅방 #${widget.roomId}', style: TdsTypography.title)),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              cacheExtent: 900,
              padding: const EdgeInsets.symmetric(
                  horizontal: TdsSpacing.lg, vertical: TdsSpacing.lg),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final item = _messages[index];
                return _MessageBubble(
                  message: item,
                  onRetry: item.status == _SendStatus.failed
                      ? () => _retryMessage(item.id)
                      : null,
                );
              },
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                  TdsSpacing.md, TdsSpacing.sm, TdsSpacing.md, TdsSpacing.md),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      minLines: 1,
                      maxLines: 3,
                      decoration: TdsComponentStyles.inputDecoration(hint: '메시지 입력'),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: TdsSpacing.sm),
                  FilledButton(
                    onPressed: _sendMessage,
                    style: TdsComponentStyles.primaryButton(),
                    child: const Text('전송'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  const _MessageBubble({required this.message, this.onRetry});

  final _ChatMessage message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final align = message.mine ? Alignment.centerRight : Alignment.centerLeft;
    final bg = message.mine ? TdsColor.bubbleMine : TdsColor.white;

    final prefix = switch (message.type) {
      _MessageType.image => '🖼 ',
      _MessageType.link => '🔗 ',
      _MessageType.text => '',
    };

    final statusText = switch (message.status) {
      _SendStatus.sending => '전송 중...',
      _SendStatus.sent => '전송 완료',
      _SendStatus.failed => '전송 실패',
    };

    return Align(
      alignment: align,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: TdsSpacing.xs),
        padding: const EdgeInsets.symmetric(
            horizontal: TdsSpacing.md, vertical: TdsSpacing.md),
        constraints: const BoxConstraints(maxWidth: 280),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(TdsRadius.md),
          border: Border.all(color: TdsColor.line),
        ),
        child: Column(
          crossAxisAlignment:
              message.mine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text('$prefix${message.text}', style: TdsTypography.body),
            const SizedBox(height: 6),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  statusText,
                  style: TextStyle(
                    fontSize: 11,
                    color: message.status == _SendStatus.failed
                        ? TdsColor.error
                        : TdsColor.textTertiary,
                  ),
                ),
                if (onRetry != null) ...[
                  const SizedBox(width: TdsSpacing.sm),
                  TextButton(
                    onPressed: onRetry,
                    style: TextButton.styleFrom(
                      minimumSize: Size.zero,
                      padding: EdgeInsets.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Text('재전송'),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}

enum _MessageType { text, link, image }

enum _SendStatus { sending, sent, failed }

class _ChatMessage {
  const _ChatMessage({
    required this.id,
    required this.text,
    required this.mine,
    required this.type,
    required this.status,
  });

  final String id;
  final String text;
  final bool mine;
  final _MessageType type;
  final _SendStatus status;

  _ChatMessage copyWith({
    String? id,
    String? text,
    bool? mine,
    _MessageType? type,
    _SendStatus? status,
  }) {
    return _ChatMessage(
      id: id ?? this.id,
      text: text ?? this.text,
      mine: mine ?? this.mine,
      type: type ?? this.type,
      status: status ?? this.status,
    );
  }
}
