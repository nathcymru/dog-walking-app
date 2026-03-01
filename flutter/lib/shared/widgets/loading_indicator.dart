import 'package:dog_walking_app/shared/platform_helpers.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class LoadingIndicator extends StatelessWidget {
  const LoadingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: isCupertinoPlatform
          ? const CupertinoActivityIndicator()
          : const CircularProgressIndicator(),
    );
  }
}
