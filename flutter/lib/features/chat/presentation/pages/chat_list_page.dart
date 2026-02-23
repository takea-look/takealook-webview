import 'dart:math';

import 'package:flutter/material.dart';

import '../../../../shared/widgets/state_placeholders.dart';

class ChatListPage extends StatefulWidget {
  const ChatListPage({super.key});

  static const routeName = '/chat';

  @override
  State<ChatListPage> createState() => _ChatListPageState();
}

class _ChatListPageState extends State<ChatListPage> {
  final _rooms = <_ChatRoomItem>[];
  bool _loading = true;
  AppErrorCase? _errorCase;
  int _failureCount = 0;
  int _page = 1;

  @override
  void initState() {
    super.initState();
    _loadInitial();
  }

  Future<void> _loadInitial() async {
    setState(() {
      _loading = true;
      _errorCase = null;
    });

    await Future<void>.delayed(const Duration(milliseconds: 300));
    if (!mounted) return;

    setState(() {
      _rooms
        ..clear()
        ..addAll(_mockRooms(page: 1));
      _page = 1;
      _loading = false;
      _failureCount = 0;
    });
  }

  Future<void> _refresh() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    if (!mounted) return;

    final random = Random().nextInt(10);
    if (random == 0) {
      setState(() {
        _errorCase = AppErrorCase.network;
        _failureCount += 1;
      });
      return;
    }

    setState(() {
      _errorCase = null;
      _rooms
        ..clear()
        ..addAll(_mockRooms(page: 1));
      _page = 1;
    });
  }

  Future<void> _loadMore() async {
    await Future<void>.delayed(const Duration(milliseconds: 180));
    if (!mounted) return;

    setState(() {
      _page += 1;
      _rooms.addAll(_mockRooms(page: _page));
    });
  }

  List<_ChatRoomItem> _mockRooms({required int page}) {
    if (page == 1) {
      return List.generate(
        10,
        (i) => _ChatRoomItem(
          id: '${i + 1}',
          name: '채팅방 ${i + 1}',
          lastMessage: i.isEven ? '최근 메시지 미리보기' : 'https://takealook.my/help',
          timeLabel: '${(i + 1) * 3}분 전',
          unread: i % 3,
        ),
      );
    }

    return List.generate(
      6,
      (i) => _ChatRoomItem(
        id: '${(page - 1) * 10 + i + 1}',
        name: '채팅방 ${(page - 1) * 10 + i + 1}',
        lastMessage: '추가 로드된 메시지',
        timeLabel: '방금 전',
        unread: i % 2,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('채팅방 목록')),
        body:
            const LoadingPlaceholder(showCard: true, message: '채팅방 불러오는 중...'),
      );
    }

    if (_errorCase != null && _rooms.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('채팅방 목록')),
        body: RecoveryErrorPlaceholder(
          errorCase: _errorCase!,
          failureCount: _failureCount,
          onRetry: _loadInitial,
        ),
      );
    }

    if (_rooms.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('채팅방 목록')),
        body: const EmptyPlaceholder(message: '채팅방이 없습니다.'),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('채팅방 목록')),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: ListView.separated(
          itemCount: _rooms.length + 1,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (context, i) {
            if (i == _rooms.length) {
              return ListTile(
                title: const Text('더 보기'),
                trailing: const Icon(Icons.expand_more),
                onTap: _loadMore,
              );
            }

            final room = _rooms[i];
            return ListTile(
              leading: CircleAvatar(child: Text(room.name.substring(0, 1))),
              title: Row(
                children: [
                  Expanded(
                      child: Text(room.name, overflow: TextOverflow.ellipsis)),
                  Text(room.timeLabel,
                      style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
              subtitle: Text(room.lastMessage,
                  maxLines: 1, overflow: TextOverflow.ellipsis),
              trailing: room.unread > 0
                  ? CircleAvatar(
                      radius: 11,
                      backgroundColor: Colors.red,
                      child: Text(
                        '${room.unread}',
                        style:
                            const TextStyle(fontSize: 11, color: Colors.white),
                      ),
                    )
                  : null,
              onTap: () => Navigator.of(context).pushNamed('/chat/${room.id}'),
            );
          },
        ),
      ),
    );
  }
}

class _ChatRoomItem {
  const _ChatRoomItem({
    required this.id,
    required this.name,
    required this.lastMessage,
    required this.timeLabel,
    required this.unread,
  });

  final String id;
  final String name;
  final String lastMessage;
  final String timeLabel;
  final int unread;
}
